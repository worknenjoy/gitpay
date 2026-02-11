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
  console.log(`${C.bold}📅 Monthly Earnings (Net) & Balances${C.reset}`)
  console.log(
    `${C.gray}${pad('Month', 9)} | ${pad('Net change', 12)} | ${pad('Net pos.', 12)} | ${pad('Stripe cash', 12)} | ${pad('Wallet', 10)} | ${pad('Task liab.', 12)} | ${pad('New liab.', 12)} | ${pad('Stripe Δ', 12)}${C.reset}`
  )
  console.log(hr())

  let currentYear: number | null = null
  let yearEarnedCents = 0
  let yearPendingNewCents = 0
  let yearStripeDeltaCents = 0
  let yearEndRow: MonthlyBalanceRow | null = null

  const flushYearTotal = () => {
    if (currentYear === null || !yearEndRow) return

    const monthLabel = `${currentYear} TOTAL`
    const earned = formatUSD(yearEarnedCents)
    const realBal = formatUSD(yearEndRow.realBalanceEndCents)
    const stripeBal = formatUSD(yearEndRow.stripeBalanceEndCents)
    const walletBal = formatUSD(yearEndRow.walletBalanceEndCents)
    const pendingEnd = formatUSD(yearEndRow.pendingEndStripeOnlyCents)
    const pendingNew = formatUSD(yearPendingNewCents)
    const stripeDelta = formatUSD(yearStripeDeltaCents)

    const earnedColor = yearEarnedCents > 0 ? C.green : yearEarnedCents < 0 ? C.red : C.yellow
    const realColor =
      yearEndRow.realBalanceEndCents > 0
        ? C.green
        : yearEndRow.realBalanceEndCents < 0
          ? C.red
          : C.yellow
    const deltaColor =
      yearStripeDeltaCents > 0 ? C.green : yearStripeDeltaCents < 0 ? C.red : C.yellow

    console.log(
      `${C.cyan}${C.bold}${pad(monthLabel, 9)}${C.reset} | ${earnedColor}${pad(earned, 12)}${C.reset} | ${realColor}${pad(realBal, 12)}${C.reset} | ${pad(stripeBal, 12)} | ${pad(walletBal, 10)} | ${pad(pendingEnd, 12)} | ${pad(pendingNew, 12)} | ${deltaColor}${pad(stripeDelta, 12)}${C.reset}`
    )
  }

  for (const r of rows) {
    if (currentYear !== r.year) {
      flushYearTotal()
      currentYear = r.year
      yearEarnedCents = 0
      yearPendingNewCents = 0
      yearStripeDeltaCents = 0
      yearEndRow = null
      console.log(`${C.magenta}${C.bold}${currentYear}${C.reset}`)
    }

    const monthLabel = moment.utc(r.monthKey + '-01').format('YYYY-MM')
    const earned = formatUSD(r.earnedCents)
    const realBal = formatUSD(r.realBalanceEndCents)
    const stripeBal = formatUSD(r.stripeBalanceEndCents)
    const walletBal = formatUSD(r.walletBalanceEndCents)
    const pendingEnd = formatUSD(r.pendingEndStripeOnlyCents)
    const pendingNew = formatUSD(r.pendingCreatedStripeOnlyCents)
    const stripeDelta = formatUSD(r.stripeDeltaCents)

    const earnedColor = r.earnedCents > 0 ? C.green : r.earnedCents < 0 ? C.red : C.yellow
    const realColor =
      r.realBalanceEndCents > 0 ? C.green : r.realBalanceEndCents < 0 ? C.red : C.yellow
    const deltaColor = r.stripeDeltaCents > 0 ? C.green : r.stripeDeltaCents < 0 ? C.red : C.yellow

    yearEarnedCents += r.earnedCents
    yearPendingNewCents += r.pendingCreatedStripeOnlyCents
    yearStripeDeltaCents += r.stripeDeltaCents
    yearEndRow = r

    console.log(
      `${pad(monthLabel, 9)} | ${earnedColor}${pad(earned, 12)}${C.reset} | ${realColor}${pad(realBal, 12)}${C.reset} | ${pad(stripeBal, 12)} | ${pad(walletBal, 10)} | ${pad(pendingEnd, 12)} | ${pad(pendingNew, 12)} | ${deltaColor}${pad(stripeDelta, 12)}${C.reset}`
    )
  }

  flushYearTotal()

  console.log(
    `${C.dim}${C.gray}Net pos. (end) = Stripe cash (end) − Wallet (end) − Task liab. (end). Net change = Δ Net pos. across the month.${C.reset}`
  )
  console.log(
    `${C.dim}${C.gray}Task liab. = unpaid task obligations (Stripe-only). Stripe cash Δ = sum of Stripe balance transaction net within the month.${C.reset}`
  )
  console.log(hr())
}
