import moment from 'moment'
import type { MonthlyBalanceRow } from './monthlyBalance'

type ConsoleStyle = {
  reset: string
  bold: string
  dim: string
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  gray: string
}

type PrintDeps = {
  C: ConsoleStyle
  hr: (w?: number) => string
  formatUSD: (cents: number) => string
}

function pad(s: string, w: number) {
  if (s.length >= w) return s
  return s + ' '.repeat(w - s.length)
}

export function printMonthlyBalanceAllYears(rows: MonthlyBalanceRow[], deps: PrintDeps) {
  const { C, hr, formatUSD } = deps

  if (!rows.length) {
    console.log(hr())
    console.log(`${C.bold}📅 Monthly Balance (All Years)${C.reset}`)
    console.log(`${C.yellow}⚠️  No orders/payouts found.${C.reset}`)
    console.log(hr())
    return
  }

  console.log(hr())
  console.log(`${C.bold}📅 Monthly Balance (All Years)${C.reset}`)
  console.log(
    `${C.gray}${pad('Month', 9)} | ${pad('Orders (succeeded)', 18)} | ${pad('Payouts (paid)', 14)} | ${pad('Net', 12)} | #O | #P${C.reset}`
  )
  console.log(hr())

  let currentYear: number | null = null
  for (const r of rows) {
    if (currentYear !== r.year) {
      currentYear = r.year
      console.log(`${C.magenta}${C.bold}${currentYear}${C.reset}`)
    }

    const monthLabel = moment.utc(r.monthKey + '-01').format('YYYY-MM')
    const orders = formatUSD(r.ordersSucceededCents)
    const payouts = formatUSD(r.payoutsPaidCents)
    const net = formatUSD(r.netCents)

    const netColor = r.netCents > 0 ? C.green : r.netCents < 0 ? C.red : C.yellow

    console.log(
      `${pad(monthLabel, 9)} | ${pad(orders, 18)} | ${pad(payouts, 14)} | ${netColor}${pad(net, 12)}${C.reset} | ${String(r.ordersCount).padStart(2)} | ${String(r.payoutsCount).padStart(2)}`
    )
  }

  console.log(hr())
}
