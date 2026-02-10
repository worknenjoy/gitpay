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
    console.log(`${C.bold}📅 Monthly Balance (Stripe-based)${C.reset}`)
    console.log(`${C.yellow}⚠️  No data found.${C.reset}`)
    console.log(hr())
    return
  }

  console.log(hr())
  console.log(`${C.bold}📅 Monthly Balance (Stripe-based)${C.reset}`)
  console.log(
    `${C.gray}${pad('Month', 9)} | ${pad('Stripe balance', 14)} | ${pad('Pending (Stripe)', 15)} | ${pad('Final', 12)} | ${pad('Stripe Δ', 12)} | #T${C.reset}`
  )
  console.log(hr())

  let currentYear: number | null = null
  for (const r of rows) {
    if (currentYear !== r.year) {
      currentYear = r.year
      console.log(`${C.magenta}${C.bold}${currentYear}${C.reset}`)
    }

    const monthLabel = moment.utc(r.monthKey + '-01').format('YYYY-MM')
    const stripeBalance = formatUSD(r.stripeBalanceCents)
    const pendingStripe = formatUSD(r.pendingStripeOnlyCents)
    const final = formatUSD(r.finalStripeOnlyCents)
    const stripeDelta = formatUSD(r.stripeNetCents)

    const finalColor =
      r.finalStripeOnlyCents > 0 ? C.green : r.finalStripeOnlyCents < 0 ? C.red : C.yellow
    const deltaColor = r.stripeNetCents > 0 ? C.green : r.stripeNetCents < 0 ? C.red : C.yellow

    console.log(
      `${pad(monthLabel, 9)} | ${pad(stripeBalance, 14)} | ${pad(pendingStripe, 15)} | ${finalColor}${pad(final, 12)}${C.reset} | ${deltaColor}${pad(stripeDelta, 12)}${C.reset} | ${String(r.pendingTasksCount).padStart(2)}`
    )
  }

  console.log(hr())
}
