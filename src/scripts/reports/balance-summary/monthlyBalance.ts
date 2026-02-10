import Stripe from 'stripe'
import moment from 'moment'
import { Op } from 'sequelize'

type MonthKey = string // YYYY-MM

export type MonthlyBalanceRow = {
  monthKey: MonthKey
  year: number
  month: number // 1-12

  // Stripe "total" balance (available + pending) as-of month end, in cents.
  stripeBalanceEndCents: number
  // Net change in Stripe balance within the month (sum of Stripe balance transaction `net`), in cents.
  stripeDeltaCents: number

  // Wallet balance as-of month end (adds - spends), in cents.
  walletBalanceEndCents: number

  // Pending liabilities as-of month end, in cents.
  pendingEndStripeOnlyCents: number
  pendingEndCount: number

  // Pending created in this month (tasks created in the month and still pending at month end), in cents.
  pendingCreatedStripeOnlyCents: number
  pendingCreatedCount: number

  // Real balance = Stripe balance - Wallet balance - Pending
  realBalanceEndCents: number

  // Earned during the month = RealBalance(end) - RealBalance(start)
  earnedCents: number
}

const toCentsFeeAdjusted = (usd: string | number | null | undefined) =>
  Math.round((Number(usd) || 0) * 0.92 * 100)

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

type WalletEvent = {
  createdAt: Date
  deltaCents: number
}

function feeMultiplierForWalletSpend(amountUsd: number): number {
  // Matches logic in Wallet.spendBalance()
  return amountUsd >= 5000 ? 1 : 1.08
}

function buildWalletBalanceAtBoundaries(events: WalletEvent[], boundaries: Date[]): number[] {
  const sortedEvents = [...events].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  )
  const sortedBoundaries = boundaries.map((d, i) => ({ d, i })).sort((a, b) => a.d.getTime() - b.d.getTime())
  const out = new Array<number>(boundaries.length).fill(0)

  let idx = 0
  let balance = 0
  for (const b of sortedBoundaries) {
    while (idx < sortedEvents.length && sortedEvents[idx].createdAt < b.d) {
      balance += sortedEvents[idx].deltaCents
      idx += 1
    }
    out[b.i] = balance
  }
  return out
}

function pendingStripeOnlyAsOf(tasks: PendingTaskInfo[], asOf: Date): {
  cents: number
  count: number
} {
  let cents = 0
  let count = 0
  for (const t of tasks) {
    if (t.createdAt >= asOf) continue
    if (t.endPendingAt && t.endPendingAt < asOf) continue
    count += 1
    cents += toCentsFeeAdjusted(t.valueUsd)
    if (t.paypalOrderAmountUsd > 0) {
      cents -= toCentsFeeAdjusted(t.paypalOrderAmountUsd)
    }
  }
  return { cents, count }
}

function pendingCreatedStripeOnlyInPeriod(tasks: PendingTaskInfo[], start: Date, end: Date): {
  cents: number
  count: number
} {
  let cents = 0
  let count = 0
  for (const t of tasks) {
    if (t.createdAt < start || t.createdAt >= end) continue
    // Count it as "created pending" only if it is still pending at period end.
    if (t.endPendingAt && t.endPendingAt < end) continue
    count += 1
    cents += toCentsFeeAdjusted(t.valueUsd)
    if (t.paypalOrderAmountUsd > 0) {
      cents -= toCentsFeeAdjusted(t.paypalOrderAmountUsd)
    }
  }
  return { cents, count }
}

function stripeBalanceAtBoundaries(
  stripeBalanceNowCents: number,
  usdTxns: Stripe.BalanceTransaction[],
  boundariesUnix: number[]
): number[] {
  const txns = [...usdTxns].sort((a, b) => a.created - b.created)
  const totalNet = txns.reduce((sum, t) => sum + (t.net || 0), 0)

  const sortedBounds = boundariesUnix
    .map((u, i) => ({ u, i }))
    .sort((a, b) => a.u - b.u)
  const out = new Array<number>(boundariesUnix.length).fill(stripeBalanceNowCents)

  let idx = 0
  let netBefore = 0
  for (const b of sortedBounds) {
    while (idx < txns.length && txns[idx].created < b.u) {
      netBefore += txns[idx].net || 0
      idx += 1
    }
    const netAfter = totalNet - netBefore
    out[b.i] = stripeBalanceNowCents - netAfter
  }
  return out
}

export async function getMonthlyBalanceAllYears(
  deps: {
    stripe: Stripe
    stripeBalanceNowCents: number
    Task: any
    History: any
    Order: any
    WalletOrder: any
  },
  opts: { from?: Date } = {}
): Promise<MonthlyBalanceRow[]> {
  const { stripe, stripeBalanceNowCents, Task, History, Order, WalletOrder } = deps
  if (!stripe) throw new Error('stripe not provided')
  if (!Task) throw new Error('models.Task not found')
  if (!History) throw new Error('models.History not found')
  if (!Order) throw new Error('models.Order not found')
  if (!WalletOrder) throw new Error('models.WalletOrder not found')

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

  const usdTxns = stripeTxns.filter((bt) => (bt.currency || '').toLowerCase() === 'usd')

  const stripeDeltaByMonth = new Map<MonthKey, number>()
  for (const bt of usdTxns) {
    const key = monthKeyFromUnix(bt.created)
    stripeDeltaByMonth.set(key, (stripeDeltaByMonth.get(key) || 0) + (bt.net || 0))
  }

  // 3) Wallet events for as-of month boundaries.
  const [walletAdds, walletSpends] = await Promise.all([
    WalletOrder.findAll({
      where: { status: 'paid' },
      attributes: ['amount', 'createdAt'],
      order: [['createdAt', 'ASC']]
    }),
    Order.findAll({
      where: {
        provider: 'wallet',
        source_type: 'wallet-funds',
        status: 'succeeded'
      },
      attributes: ['amount', 'createdAt'],
      order: [['createdAt', 'ASC']]
    })
  ])

  const walletEvents: WalletEvent[] = []
  for (const a of walletAdds) {
    if (!a?.createdAt) continue
    walletEvents.push({
      createdAt: a.createdAt,
      deltaCents: Math.round((Number(a.amount) || 0) * 100)
    })
  }
  for (const s of walletSpends) {
    if (!s?.createdAt) continue
    const amountUsd = Number(s.amount) || 0
    const mult = feeMultiplierForWalletSpend(amountUsd)
    walletEvents.push({
      createdAt: s.createdAt,
      deltaCents: -Math.round(amountUsd * mult * 100)
    })
  }

  // 4) Compute boundaries and balances.
  type MonthPeriod = { key: MonthKey; start: Date; end: Date }
  const periods: MonthPeriod[] = monthKeys.map((key) => {
    const start = moment.utc(key + '-01').startOf('month')
    const end = start.clone().add(1, 'month')
    return { key, start: start.toDate(), end: end.toDate() }
  })

  // Boundaries needed: month start and month end for each month.
  const boundaries: Date[] = []
  const boundaryUnix: number[] = []
  for (const p of periods) {
    boundaries.push(p.start)
    boundaries.push(p.end)
    boundaryUnix.push(moment.utc(p.start).unix())
    boundaryUnix.push(moment.utc(p.end).unix())
  }

  const stripeAt = stripeBalanceAtBoundaries(stripeBalanceNowCents, usdTxns, boundaryUnix)
  const walletAt = buildWalletBalanceAtBoundaries(walletEvents, boundaries)

  const rows: MonthlyBalanceRow[] = []
  for (let i = 0; i < periods.length; i++) {
    const p = periods[i]
    const monthStart = moment.utc(p.start)
    const year = Number(monthStart.format('YYYY'))
    const month = Number(monthStart.format('M'))

    const stripeStartCents = stripeAt[i * 2]
    const stripeEndCents = stripeAt[i * 2 + 1]

    const walletStartCents = walletAt[i * 2]
    const walletEndCents = walletAt[i * 2 + 1]

    const pendingStart = pendingStripeOnlyAsOf(pendingTasks, p.start)
    const pendingEnd = pendingStripeOnlyAsOf(pendingTasks, p.end)
    const pendingCreated = pendingCreatedStripeOnlyInPeriod(pendingTasks, p.start, p.end)

    const realStartCents = stripeStartCents - walletStartCents - pendingStart.cents
    const realEndCents = stripeEndCents - walletEndCents - pendingEnd.cents
    const earnedCents = realEndCents - realStartCents

    rows.push({
      monthKey: p.key,
      year,
      month,
      stripeBalanceEndCents: stripeEndCents,
      stripeDeltaCents: stripeDeltaByMonth.get(p.key) || 0,
      walletBalanceEndCents: walletEndCents,
      pendingEndStripeOnlyCents: pendingEnd.cents,
      pendingEndCount: pendingEnd.count,
      pendingCreatedStripeOnlyCents: pendingCreated.cents,
      pendingCreatedCount: pendingCreated.count,
      realBalanceEndCents: realEndCents,
      earnedCents
    })
  }

  return rows
}
