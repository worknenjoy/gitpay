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
const { Wallet, Order, Task, Payout } = models

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

// --- layout helpers ---
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

  // If table is too wide, shrink widest shrinkable columns first.
  const tableOverhead = 1 + columns.length * 3 // borders + per-column padding
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

  const top =
    '┌' +
    colWidths.map((w) => '─'.repeat(w + 2)).join('┬') +
    '┐'
  const mid =
    '├' +
    colWidths.map((w) => '─'.repeat(w + 2)).join('┼') +
    '┤'
  const bottom =
    '└' +
    colWidths.map((w) => '─'.repeat(w + 2)).join('┴') +
    '┘'

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
      padTo(`${C.dim}(no rows)${C.reset}`, colWidths.reduce((a, b) => a + b, 0) + 3 * columns.length - 1) +
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

  const innerWidth = width - 4 // borders + spaces
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
    .reduce((sum, a) => sum + a.amount, 0) // already in cents
  const availableAmount = balance.available
    .filter((a) => a.currency === 'usd')
    .reduce((sum, a) => sum + a.amount, 0) // already in cents

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
    totalWalletBalance += Number(w.balance) || 0 // DB values in decimal (USD)
  }

  // Show both DB-decimal view and USD formatted (converted to cents for display)
  console.log(
    `${C.blue}ℹ️  [Database] Total Wallet balance (DB decimal USD): ${totalWalletBalance.toFixed(2)} ` +
      `${C.gray}(${formatUSD(toCents(totalWalletBalance))})${C.reset}`
  )

  console.timeEnd('[Step] Wallet balance calculation time')
  return totalWalletBalance // keep returning decimal
}

async function getTotalAmountForPendingTasks() {
  console.log(
    `${C.cyan}${C.bold}📝 [Step] Calculating total amount for pending Tasks in database...${C.reset}`
  )
  console.time('[Step] Pending Tasks amount calculation time')

  const tasks = await Task.findAll({
    where: {
      value: { [Op.gt]: 0 }
    },
    include: [models.Order]
  })

  const pendingTasks = tasks.filter(
    (t: any) => !t.paid && t.transfer_id === null && t.TransferId === null
  )

  let totalPendingTasksAmount = 0
  for (const t of pendingTasks) {
    totalPendingTasksAmount += Number(t.value) * 0.92 || 0 // 8% platform fee; DB values in decimal (USD)
  }

  const pendingTaskRows = pendingTasks.map((t: any) => {
    const sources =
      t.Orders?.map((o: any) => `${o.provider} ${formatUSD(toCents(o.amount))}`).join(' · ') || 'N/A'
    return {
      id: String(t.id),
      value: formatUSD(toCents(t.value)),
      created: moment(t.createdAt).format('YYYY-MM-DD HH:mm'),
      age: moment(t.createdAt).fromNow(),
      source: sources,
      TransferId: t.TransferId ?? '',
      transfer_id: t.transfer_id ?? ''
    }
  })

  printTable(
    `Pending Tasks (${pendingTasks.length})`,
    [
      { key: 'id', header: 'Task', align: 'right', minWidth: 4, maxWidth: 8 },
      { key: 'value', header: 'Value', align: 'right', minWidth: 10, maxWidth: 14 },
      { key: 'created', header: 'Created', minWidth: 16, maxWidth: 16 },
      { key: 'age', header: 'Age', minWidth: 10, maxWidth: 14 },
      { key: 'source', header: 'Source', minWidth: 18, maxWidth: 60 },
      { key: 'TransferId', header: 'TransferId', minWidth: 8, maxWidth: 12 },
      { key: 'transfer_id', header: 'transfer_id', minWidth: 8, maxWidth: 12 }
    ],
    pendingTaskRows,
    { maxWidth: termWidth() }
  )

  let totalPendingPaypalOrdersAmount = 0
  const pendingPaypalRows: Array<{ task: string; order: string; amount: string; created: string; age: string }> = []
  for (const t of pendingTasks) {
    if (t.Orders?.length > 0) {
      for (const order of t.Orders) {
        if (order.provider === 'paypal' && order.status === 'succeeded') {
          pendingPaypalRows.push({
            task: String(t.id),
            order: String(order.id),
            amount: formatUSD(toCents(order.amount)),
            created: moment(t.createdAt).format('YYYY-MM-DD HH:mm'),
            age: moment(t.createdAt).fromNow()
          })
          totalPendingPaypalOrdersAmount += Number(order.amount) * 0.92 || 0 // 8% platform fee; DB values in decimal (USD)
        }
      }
    }
  }

  printTable(
    `Pending Tasks with PayPal Orders (${pendingPaypalRows.length})`,
    [
      { key: 'task', header: 'Task', align: 'right', minWidth: 4, maxWidth: 8 },
      { key: 'order', header: 'Order', align: 'right', minWidth: 5, maxWidth: 10 },
      { key: 'amount', header: 'Amount', align: 'right', minWidth: 10, maxWidth: 14 },
      { key: 'created', header: 'Created', minWidth: 16, maxWidth: 16 },
      { key: 'age', header: 'Age', minWidth: 10, maxWidth: 14 }
    ],
    pendingPaypalRows,
    { maxWidth: termWidth() }
  )

  if (totalPendingPaypalOrdersAmount > 0) {
    console.log(
      `${C.yellow}⚠️  Note: Pending Tasks total includes ${formatUSD(toCents(totalPendingPaypalOrdersAmount))} from PayPal-related orders.${C.reset}`
    )
  }

  console.log(
    `${C.blue}ℹ️  [Database] Total amount of Tasks (DB decimal USD): ${pendingTasks.length} ` +
      `${C.blue}ℹ️  [Database] Total amount for pending Tasks (DB decimal USD): ${totalPendingTasksAmount.toFixed(2)} ` +
      `${C.gray}(${formatUSD(toCents(totalPendingTasksAmount))})${C.reset}`
  )

  console.timeEnd('[Step] Pending Tasks amount calculation time')
  return {
    totalPendingTasksAmount,
    totalPendingPaypalOrdersAmount
  } // keep returning decimal
}

async function getSummary() {
  const stripeBalance = await getCurrentStripeBalance()
  const paypalBalance = 448.67 // Placeholder for future PayPal integration
  const totalWalletBalance = await getTotalWalletBalance()
  const { totalPendingTasksAmount, totalPendingPaypalOrdersAmount } =
    await getTotalAmountForPendingTasks()
  const totalPendingTasksAmountOnlyStripe = totalPendingTasksAmount - totalPendingPaypalOrdersAmount

  return {
    stripeBalance,
    paypalBalance,
    totalWalletBalance,
    totalPendingTasksAmount,
    totalPendingPaypalOrdersAmount,
    totalPendingTasksAmountOnlyStripe
  }
}

;(async () => {
  console.log(`${C.bold}${C.magenta}🚀 Starting Gitpay Financial Summary (Simple)...${C.reset}`)
  console.time('[Total] Financial summary time')
  try {
    const summary = await getSummary()

    // Convert to cents for consistent math:
    const stripeAvailableCents = summary.stripeBalance.total
    const paypalBalanceCents = toCents(summary.paypalBalance) // DB decimal -> cents
    const walletBalanceCents = toCents(summary.totalWalletBalance) // DB decimal -> cents
    const pendingTasksCents = toCents(summary.totalPendingTasksAmount) // DB decimal -> cents
    const pendingTasksCentsOnlyStripe = toCents(summary.totalPendingTasksAmountOnlyStripe) // DB decimal -> cents
    const pendingPaypalOrdersCents = toCents(summary.totalPendingPaypalOrdersAmount) // DB decimal -> cents

    // Compute final available balance in cents
    const totalAvailableCents =
      stripeAvailableCents + paypalBalanceCents - walletBalanceCents - pendingTasksCents
    const totalAvailableCentsOnlyStripe =
      stripeAvailableCents - walletBalanceCents - pendingTasksCentsOnlyStripe

    // Pretty values
    const stripeAvailableUSD = formatUSD(stripeAvailableCents)
    const paypalBalanceUSD = formatUSD(paypalBalanceCents)
    const walletBalanceUSD = formatUSD(walletBalanceCents)
    const pendingTasksUSD = formatUSD(pendingTasksCents)
    const pendingTasksUSDOnlyStripeUSD = formatUSD(pendingTasksCentsOnlyStripe)
    const pendingPaypalOrdersUSD = formatUSD(pendingPaypalOrdersCents)
    const finalUSD = formatUSD(totalAvailableCents)
    const finalUSDOnlyStripe = formatUSD(totalAvailableCentsOnlyStripe)

    // Nicer summary view
    printCard('📊 Financial Summary', [
      ['Stripe (available)', stripeAvailableUSD],
      ['PayPal (placeholder)', paypalBalanceUSD],
      ['Wallet balance (DB)', walletBalanceUSD],
      ['Pending tasks (total)', pendingTasksUSD],
      ['Pending tasks (Stripe only)', pendingTasksUSDOnlyStripeUSD],
      ['PayPal-related pending', pendingPaypalOrdersUSD]
    ])

    printCard('🧠 Calculation (Paypal + Stripe)', [
      ['Formula', 'Available = (Stripe + PayPal) - Wallet - Pending'],
      ['Stripe + PayPal', `${stripeAvailableUSD} + ${paypalBalanceUSD}`],
      ['Minus wallet', `- ${walletBalanceUSD}`],
      ['Minus pending', `- ${pendingTasksUSD}`],
      ['Result', finalUSD]
    ])

    const bannerColor =
      totalAvailableCents > 0 ? C.bgGreen : totalAvailableCents < 0 ? C.bgRed : C.bgYellow
    const bannerTextColor = totalAvailableCents >= 0 ? C.bold : `${C.bold}${C.reset}`
    console.log(hr())
    console.log(
      `${bannerColor}${bannerTextColor}  ✅ FINAL AVAILABLE BALANCE: ${finalUSD}  ${C.reset}`
    )
    console.log(hr())

    printCard('🧠 Calculation (Stripe only)', [
      ['Formula', 'Available = Stripe - Wallet - (Pending - PayPal-related)'],
      ['Stripe', stripeAvailableUSD],
      ['Minus wallet', `- ${walletBalanceUSD}`],
      ['Minus pending adj.', `- (${pendingTasksUSD} - ${pendingPaypalOrdersUSD})`],
      ['Result', finalUSDOnlyStripe]
    ])
    console.log(
      `${bannerColor}${bannerTextColor}  ✅ FINAL AVAILABLE BALANCE FOR STRIPE: ${finalUSDOnlyStripe}  ${C.reset}`
    )
    console.log(hr())

    const periodRows = await getEarningsForAllPeriods({ Order, Payout })
    printPeriodEarnings(periodRows, { C, hr, formatUSD })

    const monthlyRows = await getMonthlyBalanceAllYears({ Order, Payout })
    printMonthlyBalanceAllYears(monthlyRows, { C, hr, formatUSD })

    // Keep original JSON dump for debugging if desired (commented to reduce noise)
    // console.log(JSON.stringify(summary, null, 2));
  } catch (err) {
    console.error(`${C.red}❌ Failed to compute financial summary:${C.reset}`, err)
    process.exitCode = 1
  } finally {
    if (models?.sequelize?.close) {
      await models.sequelize.close()
    }
    console.timeEnd('[Total] Financial summary time')
  }
})()
