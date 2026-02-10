import Stripe from 'stripe'
import moment from 'moment'
import { Op } from 'sequelize'

type MonthKey = string // YYYY-MM

export type MonthlyBalanceRow = {
  monthKey: MonthKey
  year: number
  month: number // 1-12

  // Stripe "total" balance (available + pending) at the end of this month, in cents.
  stripeBalanceCents: number

  // Stripe net change during the month (sum of Stripe balance transaction `net`), in cents.
  stripeNetCents: number

  // Pending tasks as-of month end (same definition used in the summary script), in cents.
  pendingTasksCents: number
  pendingPaypalOrdersCents: number
  pendingStripeOnlyCents: number

  // Final = Stripe balance - pendingStripeOnly
  finalStripeOnlyCents: number

  pendingTasksCount: number
}

const toCents = (n: string | number | null | undefined) => Math.round((Number(n) || 0) * 100)
const toCentsFeeAdjusted = (usd: string | number | null | undefined) =>
  Math.round((Number(usd) || 0) * 0.92 * 100)

function monthKeyFromDate(date: Date): MonthKey {
  return moment.utc(date).format('YYYY-MM')
}

function monthKeyFromUnix(unixSeconds: number): MonthKey {
  return moment.unix(unixSeconds).utc().format('YYYY-MM')
}

function parseNewValue(v: any): string {
  if (v === null || v === undefined) return ''
  return String(v).trim()
}

function isTruthyDbValue(v: string): boolean {
  const s = v.trim().toLowerCase()
  if (!s) return false
  if (s === 'null' || s === 'undefined') return false
  if (s === '0' || s === 'false') return false
  return true
}

async function listAllBalanceTransactions(
  stripe: Stripe,
  created: { gte: number; lt?: number }
): Promise<Stripe.BalanceTransaction[]> {
  const out: Stripe.BalanceTransaction[] = []
  let starting_after: string | undefined
  // Stripe max page size is 100
  for (;;) {
    const page = await stripe.balanceTransactions.list({
      limit: 100,
      created,
      ...(starting_after ? { starting_after } : {})
    })

    out.push(...page.data)
    if (!page.has_more) break
    if (page.data.length === 0) break
    starting_after = page.data[page.data.length - 1].id
  }
  return out
}

function buildMonthSeries(fromInclusive: Date, toInclusive: Date): MonthKey[] {
  const start = moment.utc(fromInclusive).startOf('month')
  const end = moment.utc(toInclusive).startOf('month')
  const months: MonthKey[] = []
  const cur = start.clone()
  while (cur.isSameOrBefore(end)) {
    months.push(cur.format('YYYY-MM'))
    cur.add(1, 'month')
  }
  return months
}

type PendingTaskInfo = {
  id: number
  createdAt: Date
  updatedAt: Date
  valueUsd: number
  endPendingAt: Date | null
  paypalOrderAmountUsd: number
}

export async function getMonthlyBalanceAllYears(
  deps: {
    stripe: Stripe
    stripeBalanceNowCents: number
    Task: any
    History: any
    Order: any
  },
  opts: { from?: Date } = {}
): Promise<MonthlyBalanceRow[]> {
  const { stripe, stripeBalanceNowCents, Task, History, Order } = deps
  if (!stripe) throw new Error('stripe not provided')
  if (!Task) throw new Error('models.Task not found')
  if (!History) throw new Error('models.History not found')
  if (!Order) throw new Error('models.Order not found')

  // 1) Load tasks and infer when each task stopped being "pending".
  const tasks: Array<any> = await Task.findAll({
    where: {
      value: { [Op.gt]: 0 }
    },
    attributes: ['id', 'value', 'paid', 'transfer_id', 'TransferId', 'createdAt', 'updatedAt'],
    order: [['createdAt', 'ASC']]
  })

  const now = new Date()
  const minTaskDate = tasks.length
    ? (tasks[0].createdAt as Date)
    : moment.utc(now).subtract(12, 'months').toDate()

  const fromDate = opts.from ?? minTaskDate
  const monthKeys = buildMonthSeries(fromDate, now)

  const taskIds = tasks.map((t) => Number(t.id)).filter((id) => Number.isFinite(id))

  // PayPal amounts used to adjust pending tasks (Stripe-only) just like the summary.
  const paypalOrders: Array<any> = taskIds.length
    ? await Order.findAll({
        where: {
          TaskId: { [Op.in]: taskIds },
          provider: 'paypal',
          status: 'succeeded'
        },
        attributes: ['TaskId', 'amount']
      })
    : []
  const paypalAmountByTask = new Map<number, number>()
  for (const o of paypalOrders) {
    const taskId = Number(o?.TaskId)
    if (!Number.isFinite(taskId)) continue
    const amt = Number(o?.amount) || 0
    paypalAmountByTask.set(taskId, (paypalAmountByTask.get(taskId) || 0) + amt)
  }

  // Fetch history for status transitions used in the "pending" definition.
  const histories: Array<any> = taskIds.length
    ? await History.findAll({
        where: {
          TaskId: { [Op.in]: taskIds },
          fields: {
            // ARRAY overlap (Postgres). This is the most selective filter available.
            [Op.overlap]: ['paid', 'transfer_id', 'TransferId']
          }
        },
        attributes: ['TaskId', 'fields', 'newValues', 'createdAt'],
        order: [
          ['TaskId', 'ASC'],
          ['createdAt', 'ASC']
        ]
      })
    : []

  const paidAtByTask = new Map<number, Date>()
  const transferredAtByTask = new Map<number, Date>()

  for (const h of histories) {
    const taskId = Number(h?.TaskId)
    if (!Number.isFinite(taskId)) continue
    const createdAt: Date | undefined = h?.createdAt
    if (!createdAt) continue

    const fields: string[] = Array.isArray(h?.fields) ? h.fields : []
    const newValues: any[] = Array.isArray(h?.newValues) ? h.newValues : []
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const nv = parseNewValue(newValues[i])

      if (field === 'paid' && nv.toLowerCase() === 'true') {
        const existing = paidAtByTask.get(taskId)
        if (!existing || createdAt < existing) paidAtByTask.set(taskId, createdAt)
      }

      if ((field === 'transfer_id' || field === 'TransferId') && isTruthyDbValue(nv)) {
        const existing = transferredAtByTask.get(taskId)
        if (!existing || createdAt < existing) transferredAtByTask.set(taskId, createdAt)
      }
    }
  }

  const pendingTasks: PendingTaskInfo[] = tasks
    .map((t) => {
      const id = Number(t?.id)
      const createdAt: Date = t?.createdAt
      const updatedAt: Date = t?.updatedAt
      const valueUsd = Number(t?.value) || 0

      const paidAt = paidAtByTask.get(id) || null
      const transferAt = transferredAtByTask.get(id) || null
      const endPendingAt = paidAt && transferAt ? (paidAt < transferAt ? paidAt : transferAt) : paidAt || transferAt

      // If current state indicates it was paid/transferred but no history exists,
      // approximate with updatedAt (keeps older data usable).
      const paidNow = Boolean(t?.paid)
      const transferredNow = Boolean(t?.transfer_id) || Boolean(t?.TransferId)
      const endPendingAtWithFallback =
        endPendingAt || (paidNow || transferredNow ? (updatedAt || null) : null)

      return {
        id,
        createdAt,
        updatedAt,
        valueUsd,
        endPendingAt: endPendingAtWithFallback,
        paypalOrderAmountUsd: paypalAmountByTask.get(id) || 0
      }
    })
    .filter((t) => Number.isFinite(t.id) && t.createdAt)

  // 2) Fetch Stripe balance transaction deltas per month (USD only).
  const stripeFrom = moment.utc(fromDate).startOf('month')
  const stripeTxns = await listAllBalanceTransactions(stripe, {
    gte: stripeFrom.unix()
  })

  const stripeNetByMonth = new Map<MonthKey, number>()
  for (const bt of stripeTxns) {
    if ((bt.currency || '').toLowerCase() !== 'usd') continue
    const key = monthKeyFromUnix(bt.created)
    stripeNetByMonth.set(key, (stripeNetByMonth.get(key) || 0) + (bt.net || 0))
  }

  // 3) Build month-end Stripe balances anchored to "now":
  // Balance(endOfMonth) = Balance(now) - sum(net of transactions AFTER that month).
  const rows: MonthlyBalanceRow[] = []
  let suffixNetCents = 0
  for (let i = monthKeys.length - 1; i >= 0; i--) {
    const key = monthKeys[i]
    const monthStart = moment.utc(key + '-01').startOf('month')
    const monthEnd = monthStart.clone().add(1, 'month') // exclusive
    const asOf = monthEnd.toDate()

    const stripeNetCents = stripeNetByMonth.get(key) || 0
    const stripeBalanceCents = stripeBalanceNowCents - suffixNetCents

    let pendingTasksCents = 0
    let pendingPaypalOrdersCents = 0
    let pendingTasksCount = 0

    for (const t of pendingTasks) {
      if (t.createdAt >= asOf) continue
      if (t.endPendingAt && t.endPendingAt < asOf) continue
      pendingTasksCount += 1
      pendingTasksCents += toCentsFeeAdjusted(t.valueUsd)
      if (t.paypalOrderAmountUsd > 0) {
        pendingPaypalOrdersCents += toCentsFeeAdjusted(t.paypalOrderAmountUsd)
      }
    }

    const pendingStripeOnlyCents = pendingTasksCents - pendingPaypalOrdersCents
    const finalStripeOnlyCents = stripeBalanceCents - pendingStripeOnlyCents

    rows.push({
      monthKey: key,
      year: Number(monthStart.format('YYYY')),
      month: Number(monthStart.format('M')),
      stripeBalanceCents,
      stripeNetCents,
      pendingTasksCents,
      pendingPaypalOrdersCents,
      pendingStripeOnlyCents,
      finalStripeOnlyCents,
      pendingTasksCount
    })

    suffixNetCents += stripeNetCents
  }

  return rows.reverse()
}
