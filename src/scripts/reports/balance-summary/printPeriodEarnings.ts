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
  console.log(`${C.bold}💰 Period Balance (Stripe-based)${C.reset}`)
  console.log(
    `${C.gray}${pad('Period', 12)} | ${pad('Stripe bal.', 12)} | ${pad('Pending', 12)} | ${pad('Final', 12)} | ${pad('Stripe Δ', 12)} | #T${C.reset}`
  )
  console.log(hr())

  for (const r of rows) {
    const stripeBal = formatUSD(r.stripeBalanceEndCents)
    const pending = formatUSD(r.pendingStripeOnlyCents)
    const final = formatUSD(r.finalStripeOnlyCents)
    const delta = formatUSD(r.stripeDeltaCents)

    const finalColor =
      r.finalStripeOnlyCents > 0 ? C.green : r.finalStripeOnlyCents < 0 ? C.red : C.yellow
    const deltaColor = r.stripeDeltaCents > 0 ? C.green : r.stripeDeltaCents < 0 ? C.red : C.yellow

    console.log(
      `${pad(r.label, 12)} | ${pad(stripeBal, 12)} | ${pad(pending, 12)} | ${finalColor}${pad(final, 12)}${C.reset} | ${deltaColor}${pad(delta, 12)}${C.reset} | ${String(r.pendingTasksCount).padStart(2)}`
    )
  }

  console.log(`${C.dim}${C.gray}Ranges use UTC day boundaries (end = start of today).${C.reset}`)
  console.log(hr())
}
