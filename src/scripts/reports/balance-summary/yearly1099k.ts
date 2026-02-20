import Stripe from 'stripe'
import moment from 'moment'

const stripe = new Stripe(process.env.STRIPE_KEY as string)

type MoneyParts = {
  grossRevenueCents: number
  refundsCents: number
  disputesCents: number
  contributorTransfersCents: number
  transferReversalsCents: number
}

const LABEL_WIDTH = 36
const SEPARATOR = '-'.repeat(47)

type CogsSource = 'stripe' | 'db'

function parseCogsSourceFromEnv(): CogsSource {
  const raw = String(process.env.COGS_SOURCE || 'stripe')
    .trim()
    .toLowerCase()
  if (raw === 'stripe' || raw === 'db') return raw
  throw new Error(`Invalid COGS_SOURCE: ${raw} (expected 'stripe' or 'db')`)
}

function parseYearFromArgs(): number {
  const raw = process.argv[2] ?? process.env.YEAR
  const year = Number(raw)
  if (!Number.isFinite(year) || year < 2000 || year > 2100) {
    throw new Error(
      `Invalid year. Usage: tsx src/scripts/reports/balance-summary/yearly1099k.ts <year> (got: ${String(
        raw
      )})`
    )
  }
  return year
}

async function listAllBalanceTransactions(created: {
  gte: number
  lt: number
}): Promise<Stripe.BalanceTransaction[]> {
  const out: Stripe.BalanceTransaction[] = []
  let starting_after: string | undefined
  for (;;) {
    const page = await stripe.balanceTransactions.list({
      limit: 100,
      created,
      ...(starting_after ? { starting_after } : {})
    })
    out.push(...page.data)
    if (!page.has_more) break
    if (page.data.length === 0) break
    starting_after = page.data[page.data.length - 1].id
  }
  return out
}

const toCentsFeeAdjusted = (usd: string | number | null | undefined) =>
  Math.round((Number(usd) || 0) * 0.92 * 100)

async function computeContributorTransfersCogsCentsFromDb(range: { start: Date; end: Date }) {
  const { start, end } = range

  // Dynamically import models so the script can still run in Stripe-only mode
  // without requiring DB connectivity.
  const sequelize = await import('sequelize')
  const { Op } = sequelize

  const modelsImport: any = await import('../../../models')
  const models = (modelsImport?.default ?? modelsImport) as any
  const db = models as any
  const { Transfer, PaymentRequestTransfer } = db

  let totalCogsCents = 0

  // 1) Issue/Task payouts (Transfers table)
  // `stripe_transfer_amount` is the gross amount funded via Stripe/wallet (USD).
  // The actual Stripe transfer is created at 92% of that amount (floored to cents).
  if (Transfer) {
    const transfers: Array<any> = await Transfer.findAll({
      where: {
        createdAt: { [Op.gte]: start, [Op.lt]: end },
        transfer_id: { [Op.ne]: null }
      },
      attributes: ['stripe_transfer_amount', 'transfer_method', 'status']
    })

    for (const tr of transfers) {
      const method = String(tr?.transfer_method || '')
      if (method !== 'stripe' && method !== 'multiple') continue

      const grossUsd = Number(tr?.stripe_transfer_amount) || 0
      if (grossUsd <= 0) continue

      const cents = Math.floor(grossUsd * 100 * 0.92)
      totalCogsCents += cents
    }
  }

  // 2) Payment Request payouts (PaymentRequestTransfers table)
  // Webhook stores `value` as the *net* transfer amount in USD.
  if (PaymentRequestTransfer) {
    const prTransfers: Array<any> = await PaymentRequestTransfer.findAll({
      where: {
        createdAt: { [Op.gte]: start, [Op.lt]: end },
        transfer_method: 'stripe',
        transfer_id: { [Op.ne]: null }
      },
      attributes: ['value', 'status']
    })

    for (const tr of prTransfers) {
      const usd = Number(tr?.value) || 0
      if (usd <= 0) continue
      totalCogsCents += Math.round(usd * 100)
    }
  }

  return {
    totalCogsCents,
    close: async () => {
      if (db?.sequelize?.close) await db.sequelize.close()
    }
  }
}

function sumCents(
  txns: Stripe.BalanceTransaction[],
  predicate: (t: Stripe.BalanceTransaction) => boolean
): number {
  let total = 0
  for (const t of txns) {
    if (!predicate(t)) continue
    total += Number(t.amount) || 0
  }
  return total
}

function formatNumberUSD(cents: number): string {
  const abs = Math.abs(cents)
  const dollars = abs / 100
  return dollars.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function formatPositive(cents: number): string {
  return formatNumberUSD(cents)
}

function formatParen(cents: number): string {
  return `(${formatNumberUSD(cents)})`
}

function formatSignedAccounting(cents: number): string {
  if (cents < 0) return formatParen(Math.abs(cents))
  return formatPositive(cents)
}

function padRight(s: string, w: number) {
  if (s.length >= w) return s
  return s + ' '.repeat(w - s.length)
}

function padLeft(s: string, w: number) {
  if (s.length >= w) return s
  return ' '.repeat(w - s.length) + s
}

type PrintLine = { label: string; value: string }

function printLines(
  lines: PrintLine[],
  widths: { labelWidth: number; valueWidth: number },
  opts?: { dashAfter?: boolean }
) {
  const { labelWidth, valueWidth } = widths
  for (const l of lines) {
    console.log(`${padRight(l.label, labelWidth)}  ${padLeft(l.value, valueWidth)}`)
  }
  if (opts?.dashAfter) {
    console.log(SEPARATOR)
  }
}

function classifyAndSum(usdTxns: Stripe.BalanceTransaction[]): MoneyParts {
  const cat = (t: Stripe.BalanceTransaction) => String((t as any).reporting_category || '').trim()
  const typ = (t: Stripe.BalanceTransaction) => String((t as any).type || '').trim()

  const isCharge = (t: Stripe.BalanceTransaction) => {
    const c = cat(t)
    const ty = typ(t)
    return (
      (c === 'charge' || c === 'payment' || ty === 'charge' || ty === 'payment') &&
      (Number(t.amount) || 0) > 0
    )
  }

  const isRefund = (t: Stripe.BalanceTransaction) => {
    const c = cat(t)
    const ty = typ(t)
    return c === 'refund' || ty === 'refund'
  }

  const isDispute = (t: Stripe.BalanceTransaction) => cat(t) === 'dispute'

  const isTransfer = (t: Stripe.BalanceTransaction) => {
    const c = cat(t)
    const ty = typ(t)
    return c === 'transfer' || ty === 'transfer'
  }

  const isTransferReversal = (t: Stripe.BalanceTransaction) => {
    const c = cat(t)
    const ty = typ(t)
    return (
      c === 'transfer_reversal' ||
      ty === 'transfer_reversal' ||
      ty === 'transfer_cancel' ||
      ty === 'transfer_refund'
    )
  }

  const grossRevenueCents = sumCents(usdTxns, isCharge)

  // Refunds/disputes: net the full category (reversals may appear as positive amounts).
  // Display convention is parentheses with a positive magnitude.
  const refundsSigned = sumCents(usdTxns, isRefund) // usually negative
  const disputesSigned = sumCents(usdTxns, isDispute) // usually negative

  const refundsCents = Math.abs(refundsSigned)
  const disputesCents = Math.abs(disputesSigned)

  // Transfers: money leaving the platform is usually negative amounts.
  // NOTE: This is a Stripe-cash view; the script can optionally compute this from DB instead.
  const transfersSigned = sumCents(usdTxns, (t) => isTransfer(t) && (Number(t.amount) || 0) < 0)
  const contributorTransfersCents = Math.abs(transfersSigned)

  // Transfer reversals: treat as inflows back to the platform (positive amounts).
  const reversalsPositive = sumCents(
    usdTxns,
    (t) => isTransferReversal(t) && (Number(t.amount) || 0) > 0
  )
  const transferReversalsCents = Math.abs(reversalsPositive)

  return {
    grossRevenueCents,
    refundsCents,
    disputesCents,
    contributorTransfersCents,
    transferReversalsCents
  }
}

;(async () => {
  const year = parseYearFromArgs()
  const cogsSource = parseCogsSourceFromEnv()
  const start = moment.utc(`${year}-01-01`).startOf('day')
  const end = start.clone().add(1, 'year')

  if (!process.env.STRIPE_KEY) {
    throw new Error('Missing STRIPE_KEY env var')
  }

  const startUnix = start.unix()
  const endUnix = end.unix()

  const txns = await listAllBalanceTransactions({ gte: startUnix, lt: endUnix })
  const usdTxns = txns.filter((t) => String(t.currency || '').toLowerCase() === 'usd')

  const sums = classifyAndSum(usdTxns)

  // Optionally override contributor transfers with DB-derived COGS
  // (same task fee-adjusted math as balance-summary's task liabilities).
  let dbCloser: null | (() => Promise<void>) = null
  if (cogsSource === 'db') {
    const dbRes = await computeContributorTransfersCogsCentsFromDb({
      start: start.toDate(),
      end: end.toDate()
    })
    sums.contributorTransfersCents = dbRes.totalCogsCents
    dbCloser = dbRes.close
  }

  const netProcessedVolumeCents = sums.grossRevenueCents - sums.refundsCents - sums.disputesCents

  const netContributorPayoutsCents = sums.contributorTransfersCents - sums.transferReversalsCents

  const platformGrossProfitCents = netProcessedVolumeCents - netContributorPayoutsCents

  const block1: PrintLine[] = [
    { label: '1099-K Gross Revenue', value: formatPositive(sums.grossRevenueCents) },
    { label: 'Less: Refunds', value: formatParen(sums.refundsCents) },
    { label: 'Less: Disputes', value: formatParen(sums.disputesCents) }
  ]

  const block1Total: PrintLine[] = [
    { label: 'Net Processed Volume', value: formatSignedAccounting(netProcessedVolumeCents) }
  ]

  const block2: PrintLine[] = [
    {
      label: 'Less: Contributor Transfers (COGS)',
      value: formatParen(sums.contributorTransfersCents)
    },
    { label: 'Add: Transfer Reversals', value: formatPositive(sums.transferReversalsCents) }
  ]

  const block2Total: PrintLine[] = [
    { label: 'Net Contributor Payouts', value: formatSignedAccounting(netContributorPayoutsCents) }
  ]

  const block3: PrintLine[] = [
    { label: 'Platform Gross Profit', value: formatSignedAccounting(platformGrossProfitCents) }
  ]

  const allLines = [...block1, ...block1Total, ...block2, ...block2Total, ...block3]
  const widths = {
    labelWidth: LABEL_WIDTH,
    valueWidth: Math.max(...allLines.map((l) => l.value.length), 10)
  }

  printLines(block1, widths, { dashAfter: true })
  printLines(block1Total, widths)
  console.log('')
  printLines(block2, widths, { dashAfter: true })
  printLines(block2Total, widths)
  console.log('')
  printLines(block3, widths)

  if (dbCloser) await dbCloser()
})().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
