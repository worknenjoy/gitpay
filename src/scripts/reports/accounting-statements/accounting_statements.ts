/*
  Accounting Statements (Year)
  - Income Statement / P&L
  - Balance Sheet (as-of year end)
  - General Ledger (CSV)

  Notes:
  - Stripe cash is computed the same way as balance-summary: we back-calculate past balances
    from the current Stripe balance and Stripe balance transactions.
  - Wallet + Pending liabilities come from the DB (event-sourced) and are included on the Balance Sheet.
  - If you need external data (bank balances, expenses), edit `externalData` below.
*/

import moment from 'moment'
import type Stripe from 'stripe'

import StripeFactory from '../../../client/payment/stripe'
import ModelsImport from '../../../models'

import { csvEscape } from '../revenue-reports/lib/format'
import {
  getMonthlyBalanceAllYears,
  type MonthlyBalanceRow
} from '../balance-summary/monthlyBalance'

type ExternalExpense = {
  date: string // YYYY-MM-DD
  amountCents: number
  memo: string
  account?: string // defaults to Expense:External
  cashAccount?: string // defaults to Cash:Bank
}

type ExternalOtherIncome = {
  date: string // YYYY-MM-DD
  amountCents: number
  memo: string
  account?: string // defaults to Income:Other
  cashAccount?: string // defaults to Cash:Bank
}

// ====== Fill in external data here (optional) ======
const externalData: {
  bankBalanceEndCents?: number
  expenses: ExternalExpense[]
  otherIncome: ExternalOtherIncome[]
} = {
  // Example: year-end bank balance, if you want it on the Balance Sheet
  // bankBalanceEndCents: 0,

  // Example expense:
  // expenses: [{ date: '2025-02-01', amountCents: 1999, memo: 'SaaS: Example' }],
  expenses: [
    {
      date: '2025-05-01',
      amountCents: 89500,
      memo: 'IRS tax payment for 2024 (estimated)',
      account: 'Expenses:Tax:IRS',
      cashAccount: 'Assets:Cash:Bank'
    }
  ],

  // Example other income:
  // otherIncome: [{ date: '2025-06-15', amountCents: 50000, memo: 'Other income' }],
  otherIncome: []
}

function readArg(names: string[]): string | null {
  const withEq = process.argv.find((a) => names.some((n) => a.startsWith(`${n}=`)))
  if (withEq) return withEq.split('=')[1]
  const idx = process.argv.findIndex((a) => names.includes(a))
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]
  return null
}

function parseYear(): number {
  const raw = readArg(['--year', '-y']) ?? process.env.YEAR
  const year = Number(raw)
  if (!Number.isFinite(year) || year < 2000 || year > 2100) {
    throw new Error(
      `Invalid year. Usage: tsx src/scripts/reports/accounting-statements/accounting_statements.ts --year=2025 (got: ${String(
        raw
      )})`
    )
  }
  return year
}

const formatUSD = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

async function getStripeBalanceNowUsdTotalCents(stripe: Stripe): Promise<number> {
  const balance = await stripe.balance.retrieve()
  const pending = (balance.pending || [])
    .filter((a) => (a.currency || '').toLowerCase() === 'usd')
    .reduce((sum, a) => sum + (a.amount || 0), 0)
  const available = (balance.available || [])
    .filter((a) => (a.currency || '').toLowerCase() === 'usd')
    .reduce((sum, a) => sum + (a.amount || 0), 0)
  return pending + available
}

async function listAllBalanceTransactionsInRange(
  stripe: Stripe,
  created: { gte: number; lt: number }
): Promise<Stripe.BalanceTransaction[]> {
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

type StripeYearCashSummary = {
  grossReceiptsCents: number
  refundsCents: number
  disputesCents: number
  contributorTransfersCents: number
  transferReversalsCents: number
  stripeFeesCents: number
  stripeNetDeltaCents: number
}

function classifyStripeCashForYear(usdTxns: Stripe.BalanceTransaction[]): StripeYearCashSummary {
  const cat = (t: Stripe.BalanceTransaction) => String((t as any).reporting_category || '').trim()
  const typ = (t: Stripe.BalanceTransaction) => String((t as any).type || '').trim()

  const sumAmount = (pred: (t: Stripe.BalanceTransaction) => boolean) =>
    usdTxns.reduce((sum, t) => (pred(t) ? sum + (Number(t.amount) || 0) : sum), 0)

  const sumFee = (pred: (t: Stripe.BalanceTransaction) => boolean) =>
    usdTxns.reduce((sum, t) => (pred(t) ? sum + (Number((t as any).fee) || 0) : sum), 0)

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

  const grossReceiptsCents = sumAmount(isCharge)
  const refundsSigned = sumAmount(isRefund) // typically negative
  const disputesSigned = sumAmount(isDispute) // typically negative

  const transfersSigned = sumAmount((t) => isTransfer(t) && (Number(t.amount) || 0) < 0)
  const reversalsPositive = sumAmount((t) => isTransferReversal(t) && (Number(t.amount) || 0) > 0)

  const stripeFeesCents = sumFee(() => true)
  const stripeNetDeltaCents = usdTxns.reduce((sum, t) => sum + (Number((t as any).net) || 0), 0)

  return {
    grossReceiptsCents,
    refundsCents: Math.abs(refundsSigned),
    disputesCents: Math.abs(disputesSigned),
    contributorTransfersCents: Math.abs(transfersSigned),
    transferReversalsCents: Math.abs(reversalsPositive),
    stripeFeesCents,
    stripeNetDeltaCents
  }
}

type GLRow = {
  Date: string
  JournalId: string
  Account: string
  Debit: string
  Credit: string
  Memo: string
}

function centsToDecimalString(cents: number): string {
  const abs = Math.abs(cents)
  return (abs / 100).toFixed(2)
}

function addLine(
  rows: GLRow[],
  base: { dateISO: string; journalId: string; memo: string },
  account: string,
  debitCents: number,
  creditCents: number
) {
  rows.push({
    Date: base.dateISO,
    JournalId: base.journalId,
    Account: account,
    Debit: debitCents > 0 ? centsToDecimalString(debitCents) : '',
    Credit: creditCents > 0 ? centsToDecimalString(creditCents) : '',
    Memo: base.memo
  })
}

function buildCsv(rows: GLRow[]): string {
  const headers = ['Date', 'JournalId', 'Account', 'Debit', 'Credit', 'Memo']
  const lines = [headers.join(',')]
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.Date),
        csvEscape(r.JournalId),
        csvEscape(r.Account),
        csvEscape(r.Debit),
        csvEscape(r.Credit),
        csvEscape(r.Memo)
      ].join(',')
    )
  }
  return lines.join('\n')
}

function sumExternalForYear<T extends { date: string; amountCents: number }>(
  year: number,
  items: T[]
): number {
  let sum = 0
  for (const it of items) {
    const d = moment.utc(it.date, 'YYYY-MM-DD', true)
    if (!d.isValid()) continue
    if (d.year() !== year) continue
    sum += Number(it.amountCents) || 0
  }
  return sum
}

function findLastRowForYear(rows: MonthlyBalanceRow[], year: number): MonthlyBalanceRow | null {
  const rowsYear = rows.filter((r) => r.year === year)
  if (!rowsYear.length) return null
  return rowsYear[rowsYear.length - 1]
}

async function main() {
  const year = parseYear()
  const startUnix = Math.floor(Date.UTC(year, 0, 1, 0, 0, 0) / 1000)
  const endUnix = Math.floor(Date.UTC(year + 1, 0, 1, 0, 0, 0) / 1000)

  const stripe = StripeFactory() as Stripe
  if (!process.env.STRIPE_KEY) throw new Error('Missing STRIPE_KEY env var')

  const modelsAny = (ModelsImport as any)?.default ?? (ModelsImport as any)
  const models = modelsAny as any

  const { Task, History, Order, WalletOrder } = models
  if (!Task || !History || !Order || !WalletOrder) {
    throw new Error('Required DB models not found (Task, History, Order, WalletOrder)')
  }

  console.log(`==> Accounting statements for year ${year}`)

  // 1) Stripe balance now (cents) for back-calculation of historical balances.
  const stripeBalanceNowCents = await getStripeBalanceNowUsdTotalCents(stripe)

  // 2) Monthly reconciliation rows (include Dec of previous year for deltas).
  const fromDate = moment.utc({ year: year - 1, month: 11, date: 1 }).toDate() // Dec 1 previous year
  const monthlyRows = await getMonthlyBalanceAllYears(
    {
      stripe,
      stripeBalanceNowCents,
      Task,
      History,
      Order,
      WalletOrder
    },
    { from: fromDate }
  )

  const rowsForYear = monthlyRows.filter((r) => r.year === year)
  if (!rowsForYear.length) {
    console.warn(`No monthly rows found for year ${year}.`) // still continue with Stripe cash summary
  }

  const openingRow = findLastRowForYear(monthlyRows, year - 1)
  const closingRow = findLastRowForYear(monthlyRows, year)

  const netIncomeInternalCents = rowsForYear.reduce((sum, r) => sum + (r.earnedCents || 0), 0)

  // 3) Stripe cash (cash-basis) summary for the year.
  const stripeTxnsYear = await listAllBalanceTransactionsInRange(stripe, {
    gte: startUnix,
    lt: endUnix
  })
  const usdTxnsYear = stripeTxnsYear.filter((t) => (t.currency || '').toLowerCase() === 'usd')
  const stripeCash = classifyStripeCashForYear(usdTxnsYear)

  // 4) External adjustments (manual for now).
  const externalExpenseCents = sumExternalForYear(year, externalData.expenses)
  const externalOtherIncomeCents = sumExternalForYear(year, externalData.otherIncome)

  const netIncomeAfterExternalCents =
    netIncomeInternalCents - externalExpenseCents + externalOtherIncomeCents

  // ===== Income Statement (simplified) =====
  const pnl = {
    year,
    currency: 'USD',
    method: {
      netIncomeInternal:
        'Change in (Stripe cash − Wallet liability − Pending liability), summed monthly',
      stripeCashBreakdown:
        'Stripe Balance Transactions (cash basis; includes wallet topups, payouts, etc)'
    },
    stripeCashBasis: {
      grossReceipts: stripeCash.grossReceiptsCents,
      refunds: stripeCash.refundsCents,
      disputes: stripeCash.disputesCents,
      stripeFees: stripeCash.stripeFeesCents,
      contributorTransfersCOGS: stripeCash.contributorTransfersCents,
      transferReversals: stripeCash.transferReversalsCents,
      stripeNetDelta: stripeCash.stripeNetDeltaCents
    },
    external: {
      expenses: externalExpenseCents,
      otherIncome: externalOtherIncomeCents
    },
    netIncome: {
      internal: netIncomeInternalCents,
      afterExternal: netIncomeAfterExternalCents
    }
  }

  // ===== Balance Sheet (as-of year end) =====
  const stripeCashEndCents = closingRow?.stripeBalanceEndCents ?? 0
  const walletLiabEndCents = closingRow?.walletBalanceEndCents ?? 0
  const pendingLiabEndCents = closingRow?.pendingEndStripeOnlyCents ?? 0
  const bankCashEndCents = externalData.bankBalanceEndCents ?? 0

  const assetsTotalCents = stripeCashEndCents + bankCashEndCents
  const liabilitiesTotalCents = walletLiabEndCents + pendingLiabEndCents
  const equityCents = assetsTotalCents - liabilitiesTotalCents

  const balanceSheet = {
    asOf: moment.utc({ year, month: 11, date: 31 }).endOf('day').toISOString(),
    year,
    currency: 'USD',
    assets: {
      stripeCash: stripeCashEndCents,
      bankCash: bankCashEndCents,
      total: assetsTotalCents
    },
    liabilities: {
      walletCustody: walletLiabEndCents,
      pendingTasksStripeOnly: pendingLiabEndCents,
      total: liabilitiesTotalCents
    },
    equity: {
      computed: equityCents,
      note: 'Equity is computed as Assets − Liabilities (includes any external bank cash you provided).'
    },
    reconciliation: {
      netPositionStripeOnly: closingRow?.realBalanceEndCents ?? null,
      openingNetPositionStripeOnly: openingRow?.realBalanceEndCents ?? null
    }
  }

  // ===== General Ledger (monthly, reconciliation-based) =====
  // This GL is intentionally compact: it shows how (Cash, Wallet liability, Pending liability)
  // changed each month, with Net Income as the balancing line.
  const glRows: GLRow[] = []

  const rowsWithPrev: Array<{ prev: MonthlyBalanceRow | null; cur: MonthlyBalanceRow }> = []
  for (let i = 0; i < monthlyRows.length; i++) {
    const cur = monthlyRows[i]
    if (cur.year !== year) continue
    const prev = i > 0 ? monthlyRows[i - 1] : null
    rowsWithPrev.push({ prev, cur })
  }

  for (const pair of rowsWithPrev) {
    const cur = pair.cur
    const prev = pair.prev

    const endDateISO = moment
      .utc(cur.monthKey + '-01')
      .endOf('month')
      .format('YYYY-MM-DD')
    const journalId = `MB-${cur.monthKey}`

    const deltaStripe = cur.stripeDeltaCents
    const deltaWallet = prev ? cur.walletBalanceEndCents - prev.walletBalanceEndCents : 0
    const deltaPending = prev ? cur.pendingEndStripeOnlyCents - prev.pendingEndStripeOnlyCents : 0

    const netIncome = cur.earnedCents

    const base = {
      dateISO: endDateISO,
      journalId,
      memo: `Monthly reconciliation ${cur.monthKey}`
    }

    // Cash:Stripe (asset) — increase is debit.
    if (deltaStripe > 0) addLine(glRows, base, 'Assets:Cash:Stripe', deltaStripe, 0)
    if (deltaStripe < 0) addLine(glRows, base, 'Assets:Cash:Stripe', 0, Math.abs(deltaStripe))

    // Wallet liability — increase is credit.
    if (deltaWallet > 0) addLine(glRows, base, 'Liabilities:WalletCustody', 0, deltaWallet)
    if (deltaWallet < 0)
      addLine(glRows, base, 'Liabilities:WalletCustody', Math.abs(deltaWallet), 0)

    // Pending tasks liability — increase is credit.
    if (deltaPending > 0) addLine(glRows, base, 'Liabilities:PendingTasks', 0, deltaPending)
    if (deltaPending < 0)
      addLine(glRows, base, 'Liabilities:PendingTasks', Math.abs(deltaPending), 0)

    // Net income (plug) — positive income is credit.
    if (netIncome > 0) addLine(glRows, base, 'Income:NetIncome', 0, netIncome)
    if (netIncome < 0) addLine(glRows, base, 'Income:NetIncome', Math.abs(netIncome), 0)
  }

  // External expenses/income into a bank cash account (kept separate from Stripe cash).
  for (const e of externalData.expenses) {
    const d = moment.utc(e.date, 'YYYY-MM-DD', true)
    if (!d.isValid() || d.year() !== year) continue

    const base = {
      dateISO: d.format('YYYY-MM-DD'),
      journalId: `EXT-EXP-${d.format('YYYYMMDD')}`,
      memo: e.memo
    }
    const expenseAcct = e.account || 'Expenses:External'
    const cashAcct = e.cashAccount || 'Assets:Cash:Bank'

    const amt = Number(e.amountCents) || 0
    if (amt <= 0) continue
    addLine(glRows, base, expenseAcct, amt, 0)
    addLine(glRows, base, cashAcct, 0, amt)
  }

  for (const inc of externalData.otherIncome) {
    const d = moment.utc(inc.date, 'YYYY-MM-DD', true)
    if (!d.isValid() || d.year() !== year) continue

    const base = {
      dateISO: d.format('YYYY-MM-DD'),
      journalId: `EXT-INC-${d.format('YYYYMMDD')}`,
      memo: inc.memo
    }
    const incomeAcct = inc.account || 'Income:Other'
    const cashAcct = inc.cashAccount || 'Assets:Cash:Bank'

    const amt = Number(inc.amountCents) || 0
    if (amt <= 0) continue
    addLine(glRows, base, cashAcct, amt, 0)
    addLine(glRows, base, incomeAcct, 0, amt)
  }

  const glCsv = buildCsv(glRows)

  // ===== Console summary =====
  console.log('')
  console.log('--- P&L (high level) ---')
  console.log(`Net income (internal): ${formatUSD(netIncomeInternalCents)}`)
  if (externalExpenseCents || externalOtherIncomeCents) {
    console.log(`External expenses:      ${formatUSD(externalExpenseCents)}`)
    console.log(`External other income:  ${formatUSD(externalOtherIncomeCents)}`)
    console.log(`Net income (final):     ${formatUSD(netIncomeAfterExternalCents)}`)
  }

  console.log('')
  console.log('--- Balance Sheet (as-of year end) ---')
  console.log(`Assets: Stripe cash     ${formatUSD(stripeCashEndCents)}`)
  if (externalData.bankBalanceEndCents !== undefined) {
    console.log(`Assets: Bank cash       ${formatUSD(bankCashEndCents)}`)
  }
  console.log(`Liab:   Wallet custody  ${formatUSD(walletLiabEndCents)}`)
  console.log(`Liab:   Pending tasks   ${formatUSD(pendingLiabEndCents)}`)
  console.log(`Equity (computed):      ${formatUSD(equityCents)}`)

  console.log('')
  console.log('--- Stripe cash-basis breakdown (for context) ---')
  console.log(`Gross receipts:         ${formatUSD(stripeCash.grossReceiptsCents)}`)
  console.log(`Refunds:                ${formatUSD(stripeCash.refundsCents)}`)
  console.log(`Disputes:               ${formatUSD(stripeCash.disputesCents)}`)
  console.log(`Stripe fees:            ${formatUSD(stripeCash.stripeFeesCents)}`)
  console.log(`Contributor transfers:  ${formatUSD(stripeCash.contributorTransfersCents)}`)
  console.log(`Transfer reversals:     ${formatUSD(stripeCash.transferReversalsCents)}`)
  console.log(`Stripe net Δ:           ${formatUSD(stripeCash.stripeNetDeltaCents)}`)

  console.log('')
  console.log('--- BEGIN GENERAL LEDGER CSV (copy/paste) ---')
  console.log(glCsv)
  console.log('--- END GENERAL LEDGER CSV ---')

  if (models?.sequelize?.close) {
    await models.sequelize.close()
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Error generating accounting statements:', err?.message || err)
    process.exit(1)
  })
}
