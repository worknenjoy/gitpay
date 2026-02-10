import type { PeriodEarningsRow } from './periodEarnings'

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

export function printPeriodEarnings(rows: PeriodEarningsRow[], deps: PrintDeps) {
  const { C, hr, formatUSD } = deps

  console.log(hr())
  console.log(`${C.bold}💰 Period Earnings & Balance${C.reset}`)
  console.log(
    `${C.gray}${pad('Period', 12)} | ${pad('Earned', 12)} | ${pad('Real bal.', 12)} | ${pad('Stripe bal.', 12)} | ${pad('Wallet', 10)} | ${pad('Pending end', 12)} | ${pad('Pending new', 12)} | ${pad('Stripe Δ', 12)}${C.reset}`
  )
  console.log(hr())

  for (const r of rows) {
    const earned = formatUSD(r.earnedCents)
    const realBal = formatUSD(r.realBalanceEndCents)
    const stripeBal = formatUSD(r.stripeBalanceEndCents)
    const walletBal = formatUSD(r.walletBalanceEndCents)
    const pendingEnd = formatUSD(r.pendingEndStripeOnlyCents)
    const pendingNew = formatUSD(r.pendingCreatedStripeOnlyCents)
    const delta = formatUSD(r.stripeDeltaCents)

    const earnedColor = r.earnedCents > 0 ? C.green : r.earnedCents < 0 ? C.red : C.yellow
    const realColor =
      r.realBalanceEndCents > 0 ? C.green : r.realBalanceEndCents < 0 ? C.red : C.yellow
    const deltaColor = r.stripeDeltaCents > 0 ? C.green : r.stripeDeltaCents < 0 ? C.red : C.yellow

    console.log(
      `${pad(r.label, 12)} | ${earnedColor}${pad(earned, 12)}${C.reset} | ${realColor}${pad(realBal, 12)}${C.reset} | ${pad(stripeBal, 12)} | ${pad(walletBal, 10)} | ${pad(pendingEnd, 12)} | ${pad(pendingNew, 12)} | ${deltaColor}${pad(delta, 12)}${C.reset}`
    )
  }

  console.log(`${C.dim}${C.gray}Ranges use UTC day boundaries (end = start of today).${C.reset}`)
  console.log(hr())
}
