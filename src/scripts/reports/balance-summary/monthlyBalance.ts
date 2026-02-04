import moment from 'moment'

type MoneyRow = {
  monthKey: string // YYYY-MM
  year: number
  month: number // 1-12
  ordersSucceededCents: number
  payoutsPaidCents: number
  ordersCount: number
  payoutsCount: number
}

const toCents = (n: string | number | null | undefined) =>
  Math.round((Number(n) || 0) * 100)

function ensureRow(map: Map<string, MoneyRow>, date: Date): MoneyRow {
  const monthKey = moment.utc(date).format('YYYY-MM')
  const year = Number(moment.utc(date).format('YYYY'))
  const month = Number(moment.utc(date).format('M'))

  const existing = map.get(monthKey)
  if (existing) return existing

  const next: MoneyRow = {
    monthKey,
    year,
    month,
    ordersSucceededCents: 0,
    payoutsPaidCents: 0,
    ordersCount: 0,
    payoutsCount: 0
  }
  map.set(monthKey, next)
  return next
}

export type MonthlyBalanceRow = MoneyRow & { netCents: number }

export async function getMonthlyBalanceAllYears(models: any): Promise<MonthlyBalanceRow[]> {
  const Order = models?.Order
  const Payout = models?.Payout
  if (!Order) throw new Error('models.Order not found')
  if (!Payout) throw new Error('models.Payout not found')

  const rows = new Map<string, MoneyRow>()

  const orders: Array<any> = await Order.findAll({
    where: {
      status: 'succeeded',
      currency: 'usd'
    },
    attributes: ['id', 'amount', 'createdAt'],
    order: [['createdAt', 'ASC']]
  })

  for (const o of orders) {
    const createdAt: Date | undefined = o?.createdAt
    if (!createdAt) continue
    const r = ensureRow(rows, createdAt)
    r.ordersSucceededCents += toCents(o?.amount)
    r.ordersCount += 1
  }

  const payouts: Array<any> = await Payout.findAll({
    where: {
      paid: true,
      currency: 'usd'
    },
    attributes: ['id', 'amount', 'createdAt'],
    order: [['createdAt', 'ASC']]
  })

  for (const p of payouts) {
    const createdAt: Date | undefined = p?.createdAt
    if (!createdAt) continue
    const r = ensureRow(rows, createdAt)
    r.payoutsPaidCents += toCents(p?.amount)
    r.payoutsCount += 1
  }

  return Array.from(rows.values())
    .map((r) => ({ ...r, netCents: r.ordersSucceededCents - r.payoutsPaidCents }))
    .sort((a, b) => (a.monthKey < b.monthKey ? -1 : a.monthKey > b.monthKey ? 1 : 0))
}
