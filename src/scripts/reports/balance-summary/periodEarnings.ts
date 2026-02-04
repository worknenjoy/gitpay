import moment from 'moment'
import { Op } from 'sequelize'

export type PeriodEarningsRow = {
  label: string
  startISO: string
  endISO: string
  ordersSucceededCents: number
  payoutsPaidCents: number
  netCents: number
  ordersCount: number
  payoutsCount: number
}

const toCents = (n: string | number | null | undefined) => Math.round((Number(n) || 0) * 100)

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
  models: any,
  opts: { now?: Date } = {}
): Promise<PeriodEarningsRow[]> {
  const Order = models?.Order
  const Payout = models?.Payout
  if (!Order) throw new Error('models.Order not found')
  if (!Payout) throw new Error('models.Payout not found')

  const now = opts.now ?? new Date()
  const periods = getPeriods(now)

  const out: PeriodEarningsRow[] = []
  for (const p of periods) {
    const orderWhere = {
      status: 'succeeded',
      currency: 'usd',
      createdAt: {
        [Op.gte]: p.start,
        [Op.lt]: p.end
      }
    }

    const payoutWhere = {
      paid: true,
      currency: 'usd',
      createdAt: {
        [Op.gte]: p.start,
        [Op.lt]: p.end
      }
    }

    const [ordersSum, payoutsSum, ordersCount, payoutsCount] = await Promise.all([
      Order.sum('amount', { where: orderWhere }),
      Payout.sum('amount', { where: payoutWhere }),
      Order.count({ where: orderWhere }),
      Payout.count({ where: payoutWhere })
    ])

    const ordersSucceededCents = toCents(ordersSum)
    const payoutsPaidCents = toCents(payoutsSum)

    out.push({
      label: p.label,
      startISO: moment.utc(p.start).toISOString(),
      endISO: moment.utc(p.end).toISOString(),
      ordersSucceededCents,
      payoutsPaidCents,
      netCents: ordersSucceededCents - payoutsPaidCents,
      ordersCount: Number(ordersCount) || 0,
      payoutsCount: Number(payoutsCount) || 0
    })
  }

  return out
}
