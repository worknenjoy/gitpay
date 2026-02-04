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
  console.log(`${C.bold}💰 Earnings (USD)${C.reset}`)
  console.log(
    `${C.gray}${pad('Period', 12)} | ${pad('Orders', 12)} | ${pad('Payouts', 12)} | ${pad('Net', 12)} | #O | #P${C.reset}`
  )
  console.log(hr())

  for (const r of rows) {
    const orders = formatUSD(r.ordersSucceededCents)
    const payouts = formatUSD(r.payoutsPaidCents)
    const net = formatUSD(r.netCents)
    const netColor = r.netCents > 0 ? C.green : r.netCents < 0 ? C.red : C.yellow

    console.log(
      `${pad(r.label, 12)} | ${pad(orders, 12)} | ${pad(payouts, 12)} | ${netColor}${pad(net, 12)}${C.reset} | ${String(r.ordersCount).padStart(2)} | ${String(r.payoutsCount).padStart(2)}`
    )
  }

  console.log(`${C.dim}${C.gray}Ranges use UTC day boundaries (end = start of today).${C.reset}`)
  console.log(hr())
}
