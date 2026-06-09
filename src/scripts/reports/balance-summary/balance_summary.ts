import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_KEY as string)

import { Op } from 'sequelize'
import Models from '../../../models'
import moment from 'moment'

import { getMonthlyBalanceAllYears } from './monthlyBalance'
import { printMonthlyBalanceAllYears } from './printMonthlyBalance'
import { getEarningsForAllPeriods } from './periodEarnings'
import { printPeriodEarnings } from './printPeriodEarnings'

const models = Models as any
const { Wallet, Order, Task, History, WalletOrder } = models

// === CLI flags ===
// Usage: npm run reports:balance_summary -- --stripe-balance --wallet-balance
// Available flags:
//   --stripe-balance     Show current Stripe balance
//   --wallet-balance     Show total Wallet balance from DB
//   --period-earnings    Show yesterday / last-7d / last-30d earnings
//   --monthly-earnings   Show month-by-month earnings table
//   --summary            Show the financial summary cards
// No flags → run everything (default)
const args = new Set(process.argv.slice(2))
const ALL =
  args.size === 0 ||
  (args.size === 1 && args.has('--')) ||
  (args.size === 1 && args.has('help')) ||
  (args.size === 1 && args.has('--help'))
const want = (flag: string) => ALL || args.has(flag)

// === Console helpers & formatters ===
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m'
}

const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '')
const visibleLen = (s: string) => stripAnsi(s).length
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
const termWidth = () => clamp(process.stdout.columns ?? 100, 60, 160)
const hr = (w = termWidth()) => `${C.gray}${'─'.repeat(w)}${C.reset}`

type Align = 'left' | 'right' | 'center'
const padTo = (s: string, w: number, align: Align = 'left') => {
  const len = visibleLen(s)
  if (len >= w) return s
  const pad = w - len
  if (align === 'right') return `${' '.repeat(pad)}${s}`
  if (align === 'center') {
    const left = Math.floor(pad / 2)
    const right = pad - left
    return `${' '.repeat(left)}${s}${' '.repeat(right)}`
  }
  return `${s}${' '.repeat(pad)}`
}
const truncate = (s: string, w: number) => {
  if (w <= 0) return ''
  if (visibleLen(s) <= w) return s
  if (w <= 1) return stripAnsi(s).slice(0, 1)
  const raw = stripAnsi(s)
  return `${raw.slice(0, Math.max(0, w - 1))}…`
}

type TableColumn<Row extends Record<string, any>> = {
  key: keyof Row
  header: string
  align?: Align
  minWidth?: number
  maxWidth?: number
}

function printTable<Row extends Record<string, any>>(
  title: string,
  columns: Array<TableColumn<Row>>,
  rows: Row[],
  opts?: { maxWidth?: number }
) {
  const maxWidth = opts?.maxWidth ?? termWidth()
  const colWidths = columns.map((c) => {
    const headerLen = visibleLen(c.header)
    const cellMax = rows.reduce((m, r) => {
      const v = r[c.key]
      const s = v === null || v === undefined ? '' : String(v)
      return Math.max(m, visibleLen(s))
    }, 0)
    const base = Math.max(headerLen, cellMax, c.minWidth ?? 0)
    return clamp(base, c.minWidth ?? 0, c.maxWidth ?? 999)
  })

  const tableOverhead = 1 + columns.length * 3
  const totalWidth = () => tableOverhead + colWidths.reduce((a, b) => a + b, 0)
  while (totalWidth() > maxWidth) {
    let widestIdx = -1
    let widest = 0
    for (let i = 0; i < colWidths.length; i++) {
      const min = columns[i].minWidth ?? 0
      if (colWidths[i] > min && colWidths[i] > widest) {
        widest = colWidths[i]
        widestIdx = i
      }
    }
    if (widestIdx === -1) break
    colWidths[widestIdx] -= 1
  }

  const top = '┌' + colWidths.map((w) => '─'.repeat(w + 2)).join('┬') + '┐'
  const mid = '├' + colWidths.map((w) => '─'.repeat(w + 2)).join('┼') + '┤'
  const bottom = '└' + colWidths.map((w) => '─'.repeat(w + 2)).join('┴') + '┘'

  console.log(`${C.bold}${title}${C.reset}`)
  console.log(`${C.gray}${top}${C.reset}`)
  const headerRow =
    '│' +
    columns
      .map((c, i) => {
        const cell = padTo(truncate(c.header, colWidths[i]), colWidths[i], 'center')
        return ` ${cell} `
      })
      .join('│') +
    '│'
  console.log(`${C.gray}${headerRow}${C.reset}`)
  console.log(`${C.gray}${mid}${C.reset}`)

  if (rows.length === 0) {
    const empty =
      '│' +
      padTo(
        `${C.dim}(no rows)${C.reset}`,
        colWidths.reduce((a, b) => a + b, 0) + 3 * columns.length - 1
      ) +
      '│'
    console.log(empty)
  } else {
    for (const r of rows) {
      const line =
        '│' +
        columns
          .map((c, i) => {
            const raw = r[c.key]
            const cellStr = raw === null || raw === undefined ? '' : String(raw)
            const cell = padTo(truncate(cellStr, colWidths[i]), colWidths[i], c.align ?? 'left')
            return ` ${cell} `
          })
          .join('│') +
        '│'
      console.log(line)
    }
  }
  console.log(`${C.gray}${bottom}${C.reset}`)
}

function printCard(title: string, entries: Array<[string, string]>, opts?: { width?: number }) {
  const width = clamp(opts?.width ?? Math.min(termWidth(), 120), 60, 140)
  const labelWidth = clamp(
    Math.max(...entries.map(([k]) => visibleLen(k)), visibleLen(title)),
    10,
    28
  )

  const innerWidth = width - 4
  const top = `┌${'─'.repeat(width - 2)}┐`
  const bottom = `└${'─'.repeat(width - 2)}┘`
  const titleLine = `│ ${padTo(`${C.bold}${title}${C.reset}`, width - 4, 'center')} │`
  console.log(`${C.gray}${top}${C.reset}`)
  console.log(titleLine)
  console.log(`${C.gray}├${'─'.repeat(width - 2)}┤${C.reset}`)
  for (const [k, v] of entries) {
    const left = padTo(k, labelWidth, 'left')
    const right = truncate(v, innerWidth - (labelWidth + 2))
    const line = `│ ${left}: ${padTo(right, innerWidth - (labelWidth + 2), 'left')} │`
    console.log(line)
  }
  console.log(`${C.gray}${bottom}${C.reset}`)
}

const toCents = (n: number) => Math.round((Number(n) || 0) * 100)
const formatUSD = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

async function getCurrentStripeBalance() {
  console.log(`${C.cyan}${C.bold}🔎 [Step] Fetching current Stripe balance...${C.reset}`)
  console.time('[Step] Stripe balance fetch time')

  const balance = await stripe.balance.retrieve()

  const availablePretty = balance.available
    .map((a) => `${formatUSD(a.amount)} ${a.currency.toUpperCase()}`)
    .join(`${C.gray} | ${C.reset}`)

  const pendingPretty = balance.pending
    .map((a) => `${formatUSD(a.amount)} ${a.currency.toUpperCase()}`)
    .join(`${C.gray} | ${C.reset}`)

  console.log(`${C.blue}ℹ️  [Stripe] Pending: ${pendingPretty}${C.reset}`)
  console.log(`${C.blue}ℹ️  [Stripe] Available: ${availablePretty}${C.reset}`)

  const pendingAmount = balance.pending
    .filter((a) => a.currency === 'usd')
    .reduce((sum, a) => sum + a.amount, 0)
  const availableAmount = balance.available
    .filter((a) => a.currency === 'usd')
    .reduce((sum, a) => sum + a.amount, 0)

  const totalAmount = pendingAmount + availableAmount
  console.log(
    `${C.blue}ℹ️  [Stripe] Total Balance (Available + Pending): ${formatUSD(totalAmount)}${C.reset}`
  )

  console.timeEnd('[Step] Stripe balance fetch time')
  return {
    available: balance.available,
    pending: balance.pending,
    total: totalAmount
  }
}

async function getTotalWalletBalance() {
  console.log(
    `${C.cyan}${C.bold}🧮 [Step] Calculating total Wallet balance from database...${C.reset}`
  )
  console.time('[Step] Wallet balance calculation time')

  const wallets = await Wallet.findAll({
    where: {
      balance: { [Op.gt]: 0 }
    }
  })

  let totalWalletBalance = 0
  for (const w of wallets) {
    totalWalletBalance += Number(w.balance) || 0
  }

  console.log(
    `${C.blue}ℹ️  [Database] Total Wallet balance (DB decimal USD): ${totalWalletBalance.toFixed(2)} ` +
      `${C.gray}(${formatUSD(toCents(totalWalletBalance))})${C.reset}`
  )

  console.timeEnd('[Step] Wallet balance calculation time')
  return totalWalletBalance
}

;(async () => {
  if (args.has('--help') || args.has('help')) {
    console.log(`
${C.bold}Usage:${C.reset} npm run reports:balance_summary -- [flags]

${C.bold}Flags:${C.reset}
  --stripe-balance     Show current Stripe balance (available + pending)
  --wallet-balance     Show total Wallet balance from the database
  --summary            Show the financial summary cards
  --period-earnings    Show earnings for yesterday / last 7d / last 30d
  --monthly-earnings   Show month-by-month earnings breakdown

  (no flags)           Run all sections

${C.bold}Examples:${C.reset}
  npm run reports:balance_summary
  npm run reports:balance_summary -- --monthly-earnings
  npm run reports:balance_summary -- --stripe-balance --wallet-balance
  npm run reports:balance_summary -- --summary
`)
    process.exit(0)
  }

  console.log(`${C.bold}${C.magenta}🚀 Starting Gitpay Balance Summary...${C.reset}`)
  console.time('[Total] Balance summary time')

  try {
    const paypalBalance = 448.67 // Placeholder for future PayPal integration

    let stripeBalance: Awaited<ReturnType<typeof getCurrentStripeBalance>> | undefined
    let totalWalletBalance: number | undefined

    if (want('--stripe-balance') || want('--summary')) {
      stripeBalance = await getCurrentStripeBalance()
    }

    if (want('--wallet-balance') || want('--summary')) {
      totalWalletBalance = await getTotalWalletBalance()
    }

    if (want('--summary')) {
      const stripeAvailableCents = stripeBalance!.total
      const paypalBalanceCents = toCents(paypalBalance)
      const walletBalanceCents = toCents(totalWalletBalance!)

      const totalAvailableCents = stripeAvailableCents + paypalBalanceCents - walletBalanceCents
      const totalAvailableCentsOnlyStripe = stripeAvailableCents - walletBalanceCents

      const stripeAvailableUSD = formatUSD(stripeAvailableCents)
      const paypalBalanceUSD = formatUSD(paypalBalanceCents)
      const walletBalanceUSD = formatUSD(walletBalanceCents)
      const finalUSD = formatUSD(totalAvailableCents)
      const finalUSDOnlyStripe = formatUSD(totalAvailableCentsOnlyStripe)

      const bannerColor =
        totalAvailableCents > 0 ? C.bgGreen : totalAvailableCents < 0 ? C.bgRed : C.bgYellow
      const bannerTextColor = totalAvailableCents >= 0 ? C.bold : `${C.bold}${C.reset}`

      printCard('📊 Financial Summary', [
        ['Stripe (avail + pending)', stripeAvailableUSD],
        ['PayPal (placeholder)', paypalBalanceUSD],
        ['Wallet balance (DB)', walletBalanceUSD]
      ])

      printCard('🧠 Calculation (Paypal + Stripe)', [
        ['Formula', 'Available = (Stripe + PayPal) - Wallet'],
        ['Stripe + PayPal', `${stripeAvailableUSD} + ${paypalBalanceUSD}`],
        ['Minus wallet', `- ${walletBalanceUSD}`],
        ['Result', finalUSD]
      ])

      console.log(hr())
      console.log(
        `${bannerColor}${bannerTextColor}  ✅ FINAL AVAILABLE BALANCE: ${finalUSD}  ${C.reset}`
      )
      console.log(hr())

      printCard('🧠 Calculation (Stripe only)', [
        ['Formula', 'Available = Stripe - Wallet'],
        ['Stripe', stripeAvailableUSD],
        ['Minus wallet', `- ${walletBalanceUSD}`],
        ['Result', finalUSDOnlyStripe]
      ])
      console.log(
        `${bannerColor}${bannerTextColor}  ✅ FINAL AVAILABLE BALANCE FOR STRIPE: ${finalUSDOnlyStripe}  ${C.reset}`
      )
      console.log(hr())
    }

    if (want('--period-earnings')) {
      if (!stripeBalance) stripeBalance = await getCurrentStripeBalance()
      const periodRows = await getEarningsForAllPeriods({
        stripe,
        stripeBalanceNowCents: stripeBalance.total,
        Task,
        History,
        Order,
        WalletOrder
      })
      printPeriodEarnings(periodRows, { C, hr, formatUSD })
    }

    if (want('--monthly-earnings')) {
      if (!stripeBalance) stripeBalance = await getCurrentStripeBalance()
      const fromEnv = process.env.BALANCE_SUMMARY_FROM
      const fromDate = fromEnv ? moment.utc(fromEnv).toDate() : undefined
      const monthlyRows = await getMonthlyBalanceAllYears(
        {
          stripe,
          stripeBalanceNowCents: stripeBalance.total,
          Task,
          History,
          Order,
          WalletOrder
        },
        fromDate ? { from: fromDate } : undefined
      )
      printMonthlyBalanceAllYears(monthlyRows, { C, hr, formatUSD })
    }
  } catch (err) {
    console.error(`${C.red}❌ Failed to compute balance summary:${C.reset}`, err)
    process.exitCode = 1
  } finally {
    if (models?.sequelize?.close) {
      await models.sequelize.close()
    }
    console.timeEnd('[Total] Balance summary time')
  }
})()
