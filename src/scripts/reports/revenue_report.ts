/*
  Simple Revenue Report (hardcoded for 2018)
  - Lists Stripe charges from 2018
  - For each charge, finds a related transfer via transfer_group (if any)
  - Determines status and service type by the provided rules
  - Exports a CSV compatible with Google Sheets

  Output: result/reports/revenue_2018.csv
*/

import fs from 'fs'
import path from 'path'
import StripeFactory from '../../modules/shared/stripe/stripe'

// Initialize Stripe via repo's shared factory
const stripe: any = StripeFactory()

// Year will be provided via CLI; default to 2018 if not passed

type Charge = any
type Transfer = any
type BalanceTransaction = any

type ReportRow = {
  Status: string
  'Payment source': string
  Date: string
  'Payment Method': string
  'Service type': string
  'Original amount': string
  Amount: string
  Fee: string
  'Total Fee': string
  'Stripe Fee': string
  'Transfer source': string
  'Transfer group': string
  'Transfer amount': string
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function centsToDecimal(amount: number | null | undefined, currency: string | undefined): string {
  if (typeof amount !== 'number') return ''
  // JPY and a few others have no minor unit, but charges still often present as integer "amount"
  // For Google Sheets simplicity, use 2 decimals by default except known zero-decimal currencies
  const zeroMinor = new Set(['JPY', 'KRW', 'VND'])
  const cur = (currency || '').toUpperCase()
  if (zeroMinor.has(cur)) return String(amount)
  return (amount / 100).toFixed(2)
}

function formatCurrencyPtBR(amount: number | null | undefined, currency: string | undefined): string {
  if (typeof amount !== 'number' || !currency) return ''
  const cur = currency.toUpperCase()
  try {
    // amount provided in cents; Intl expects major units
    const zeroMinor = new Set(['JPY', 'KRW', 'VND'])
    const major = zeroMinor.has(cur) ? amount : amount / 100
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: cur }).format(major)
  } catch {
    // Fallback: decimal with currency code
    return `${centsToDecimal(amount, cur)} ${cur}`.trim()
  }
}

function formatDateForSheets(tsSec: number | null | undefined): string {
  if (!tsSec) return ''
  const d = new Date(tsSec * 1000)
  // Google Sheets-friendly ISO-like without timezone designator
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mi = String(d.getUTCMinutes()).padStart(2, '0')
  const ss = String(d.getUTCSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss} UTC`
}

function csvEscape(value: string): string {
  if (value == null) return ''
  const needsQuotes = /[",\n]/.test(value) || value.includes(',')
  const v = String(value).replace(/"/g, '""')
  return needsQuotes ? `"${v}"` : v
}

function readArg(names: string[]): string | null {
  const withEq = process.argv.find(a => names.some(n => a.startsWith(`${n}=`)))
  if (withEq) return withEq.split('=')[1]
  const idx = process.argv.findIndex(a => names.includes(a))
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]
  return null
}

function getYearFromArgs(): number {
  const raw = readArg(['--year', '-y']) ?? process.env.YEAR ?? '2018'
  const n = parseInt(String(raw), 10)
  if (!isNaN(n) && n >= 2000 && n <= 2100) return n
  console.warn(`Invalid year "${raw}", defaulting to 2018`)
  return 2018
}

function getYearRangeUnix(year: number): { start: number, end: number } {
  const start = Math.floor(Date.UTC(year, 0, 1) / 1000)
  const end = Math.floor(Date.UTC(year + 1, 0, 1) / 1000)
  return { start, end }
}

async function listChargesForRange(startUnix: number, endUnix: number): Promise<Charge[]> {
  const results: Charge[] = []
  let starting_after: string | undefined = undefined
  /* eslint no-constant-condition: "off" */
  while (true) {
    const page:any = await stripe.charges.list({
      limit: 100,
      starting_after,
      created: { gte: startUnix, lt: endUnix },
      expand: ['data.balance_transaction', 'data.invoice']
    })
    if (page && Array.isArray(page.data)) {
      // Exclude failed payments (and unpaid just in case)
      const filtered = page.data.filter((ch: any) => ch?.status !== 'failed' && ch?.paid !== false)
      results.push(...filtered)
    }
    if (!page?.has_more || page.data.length === 0) break
    starting_after = page.data[page.data.length - 1].id
  }
  return results
}

async function findTransferByGroup(transfer_group?: string | null): Promise<Transfer | null> {
  if (!transfer_group) return null
  // There can be multiple transfers in a group; pick the first one (most recent later if needed)
  const transfers = await stripe.transfers.list({ transfer_group, limit: 1 })
  if (transfers?.data?.length) return transfers.data[0]
  return null
}

function computeStatus(charge: Charge, transfer: Transfer | null): string {
  // Rules:
  // - If a transfer exists for the transfer_group -> completed
  // - If the charge has a related invoice -> completed
  // - Otherwise pending
  if (transfer) return 'completed'
  if (charge?.invoice) return 'completed'
  return 'pending'
}

function computeServiceType(charge: Charge): string {
  // - If charge has transfer_group -> Bounty
  // - If charge has related invoice -> Consulting
  if (charge?.invoice) return 'Consulting'
  if (charge?.transfer_group) return 'Bounty'
  return ''
}

function getStripeFeeDecimal(bt: BalanceTransaction | null | undefined): string {
  if (!bt) return ''
  const fee = typeof bt.fee === 'number' ? bt.fee : null
  return centsToDecimal(fee, bt.currency)
}

function getAmountUSDDecimal(charge: Charge): string {
  // Prefer USD from balance transaction if available; otherwise if charge is USD, use that
  const bt: BalanceTransaction | undefined = charge?.balance_transaction
  if (bt && bt.currency && bt.currency.toLowerCase() === 'usd' && typeof bt.amount === 'number') {
    return centsToDecimal(bt.amount, 'usd')
  }
  if (charge?.currency?.toLowerCase() === 'usd' && typeof charge.amount === 'number') {
    return centsToDecimal(charge.amount, 'usd')
  }
  // Otherwise, leave empty (hardcoded simple start)
  return ''
}

async function buildRows(charges: Charge[]): Promise<ReportRow[]> {
  const rows: ReportRow[] = []
  for (const ch of charges) {
    const transfer = await findTransferByGroup(ch.transfer_group)
    const bt: BalanceTransaction | undefined = ch?.balance_transaction

    const row: ReportRow = {
      Status: computeStatus(ch, transfer),
      'Payment source': ch.id || '',
      Date: formatDateForSheets(ch.created),
      'Payment Method': 'Stripe',
      'Service type': computeServiceType(ch),
      'Original amount': formatCurrencyPtBR(ch.amount, ch.currency),
      Amount: getAmountUSDDecimal(ch),
      Fee: '',
      'Total Fee': '',
      'Stripe Fee': getStripeFeeDecimal(bt),
      'Transfer source': transfer?.id || '',
      'Transfer group': ch.transfer_group || '',
      'Transfer amount': transfer ? centsToDecimal(transfer.amount, transfer.currency) : ''
    }

    rows.push(row)
  }
  return rows
}

function rowsToCSV(rows: ReportRow[]): string {
  const headers = [
    'Status',
    'Payment source',
    'Date',
    'Payment Method',
    'Service type',
    'Original amount',
    'Amount',
    'Fee',
    'Total Fee',
    'Stripe Fee',
    'Transfer source',
    'Transfer group',
    'Transfer amount'
  ]

  const lines: string[] = []
  lines.push(headers.map(csvEscape).join(','))
  for (const r of rows) {
    const vals = headers.map((h) => csvEscape((r as any)[h] ?? ''))
    lines.push(vals.join(','))
  }
  return lines.join('\n') + '\n'
}

async function main() {
  const year = getYearFromArgs()
  const { start, end } = getYearRangeUnix(year)
  console.log(`Generating revenue report for ${year}...`)

  const charges = await listChargesForRange(start, end)
  console.log(`Fetched ${charges.length} charges from ${year}`)

  const rows = await buildRows(charges)
  console.log(`Prepared ${rows.length} rows`)

  const csv = rowsToCSV(rows)
  const outDir = path.resolve(process.cwd(), 'tmp', 'reports')
  const outFile = path.join(outDir, `revenue_${year}.csv`)
  ensureDir(outDir)
  fs.writeFileSync(outFile, csv, 'utf8')

  console.log(`Report written to: ${outFile}`)
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Error generating revenue report:', err?.message || err)
    process.exit(1)
  })
}
