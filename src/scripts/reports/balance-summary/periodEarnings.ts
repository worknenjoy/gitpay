import Stripe from 'stripe'
import moment from 'moment'
import { Op } from 'sequelize'

export type PeriodEarningsRow = {
  label: string
  startISO: string
  endISO: string

  stripeBalanceEndCents: number
  stripeDeltaCents: number

  pendingStripeOnlyCents: number
  finalStripeOnlyCents: number

  pendingTasksCount: number
}

const toCentsFeeAdjusted = (usd: string | number | null | undefined) =>
  Math.round((Number(usd) || 0) * 0.92 * 100)

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

type Period = { label: string; start: Date; end: Date }

function getPeriods(now: Date): Period[] {
  const endToday = moment.utc(now).startOf('day')

  const yesterdayStart = endToday.clone().subtract(1, 'day')
  const last7DaysStart = endToday.clone().subtract(7, 'day')
  const last30DaysStart = endToday.clone().subtract(30, 'day')

  return [
    {
      label: 'Yesterday',
      start: yesterdayStart.toDate(),
      end: endToday.toDate()
    },
    {
      label: 'Last 7 days',
      start: last7DaysStart.toDate(),
      end: endToday.toDate()
    },
    {
      label: 'Last 30 days',
      start: last30DaysStart.toDate(),
      end: endToday.toDate()
    }
  ]
}

export async function getEarningsForAllPeriods(
  deps: {
    stripe: Stripe
    stripeBalanceNowCents: number
    Task: any
    History: any
    Order: any
  },
  opts: { now?: Date } = {}
): Promise<PeriodEarningsRow[]> {
  const { stripe, stripeBalanceNowCents, Task, History, Order } = deps
  if (!stripe) throw new Error('stripe not provided')
  if (!Task) throw new Error('models.Task not found')
  if (!History) throw new Error('models.History not found')
  if (!Order) throw new Error('models.Order not found')

  const now = opts.now ?? new Date()
  const periods = getPeriods(now)

  const minStart = periods.reduce((m, p) => (p.start < m ? p.start : m), periods[0].start)

  // Load tasks and histories once, then compute pending as-of each period end.
  const tasks: Array<any> = await Task.findAll({
    where: {
      value: { [Op.gt]: 0 }
    },
    attributes: ['id', 'value', 'paid', 'transfer_id', 'TransferId', 'createdAt', 'updatedAt'],
    order: [['createdAt', 'ASC']]
  })

  const taskIds = tasks.map((t) => Number(t.id)).filter((id) => Number.isFinite(id))

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

  const histories: Array<any> = taskIds.length
    ? await History.findAll({
        where: {
          TaskId: { [Op.in]: taskIds },
          fields: {
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

  const taskInfo = tasks
    .map((t) => {
      const id = Number(t?.id)
      const createdAt: Date = t?.createdAt
      const updatedAt: Date = t?.updatedAt
      const valueUsd = Number(t?.value) || 0
      const paidAt = paidAtByTask.get(id) || null
      const transferAt = transferredAtByTask.get(id) || null
      const endPendingAt =
        paidAt && transferAt ? (paidAt < transferAt ? paidAt : transferAt) : paidAt || transferAt

      const paidNow = Boolean(t?.paid)
      const transferredNow = Boolean(t?.transfer_id) || Boolean(t?.TransferId)
      const endPendingAtWithFallback =
        endPendingAt || (paidNow || transferredNow ? (updatedAt || null) : null)

      return {
        id,
        createdAt,
        endPendingAt: endPendingAtWithFallback as Date | null,
        valueUsd,
        paypalOrderAmountUsd: paypalAmountByTask.get(id) || 0
      }
    })
    .filter((t) => Number.isFinite(t.id) && t.createdAt)

  // Stripe balance transactions for computing balance as-of each period end.
  const stripeTxns = await listAllBalanceTransactions(stripe, {
    gte: moment.utc(minStart).unix()
  })

  const usdTxns = stripeTxns.filter((bt) => (bt.currency || '').toLowerCase() === 'usd')
  const sumNetAfter = (cutoffUnix: number) =>
    usdTxns.reduce((sum, bt) => (bt.created >= cutoffUnix ? sum + (bt.net || 0) : sum), 0)
  const sumNetInRange = (startUnix: number, endUnix: number) =>
    usdTxns.reduce(
      (sum, bt) => (bt.created >= startUnix && bt.created < endUnix ? sum + (bt.net || 0) : sum),
      0
    )

  const out: PeriodEarningsRow[] = []
  for (const p of periods) {
    const startUnix = moment.utc(p.start).unix()
    const endUnix = moment.utc(p.end).unix()

    const stripeBalanceEndCents = stripeBalanceNowCents - sumNetAfter(endUnix)
    const stripeDeltaCents = sumNetInRange(startUnix, endUnix)

    let pendingTasksCents = 0
    let pendingPaypalOrdersCents = 0
    let pendingTasksCount = 0

    for (const t of taskInfo) {
      if (t.createdAt >= p.end) continue
      if (t.endPendingAt && t.endPendingAt < p.end) continue
      pendingTasksCount += 1
      pendingTasksCents += toCentsFeeAdjusted(t.valueUsd)
      if (t.paypalOrderAmountUsd > 0) {
        pendingPaypalOrdersCents += toCentsFeeAdjusted(t.paypalOrderAmountUsd)
      }
    }

    const pendingStripeOnlyCents = pendingTasksCents - pendingPaypalOrdersCents
    const finalStripeOnlyCents = stripeBalanceEndCents - pendingStripeOnlyCents

    out.push({
      label: p.label,
      startISO: moment.utc(p.start).toISOString(),
      endISO: moment.utc(p.end).toISOString(),
      stripeBalanceEndCents,
      stripeDeltaCents,
      pendingStripeOnlyCents,
      finalStripeOnlyCents,
      pendingTasksCount
    })
  }

  return out
}
