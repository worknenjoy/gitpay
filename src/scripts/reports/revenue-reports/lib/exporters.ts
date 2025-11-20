import path from 'path'
import fs from 'fs'
import { BuildTotals, ReportRow } from './types'
import { centsToDecimal, csvEscape } from './format'
import { stripe, listPayoutsForRange } from './stripe'
import { ensureDir, formatDateForSheets } from './format'

export function rowsToCSV(rows: ReportRow[], totals?: BuildTotals): string {
  const headers = [
    'Status',
    'TransactionType',
    'TransferId',
    'ChargeId',
    'ServiceType',
    'Transfer Amount',
    'Original Charge Amount',
    'Stripe Fee',
    'Transfer Date',
    'Charge Date',
    'Revenue'
  ]

  const lines: string[] = []
  lines.push(headers.map(csvEscape).join(','))
  for (const r of rows) {
    const vals = headers.map((h) => csvEscape((r as any)[h] ?? ''))
    lines.push(vals.join(','))
  }
  if (totals) {
    const totalLine = [
      csvEscape('Total'),
      csvEscape(''),
      csvEscape(''),
      csvEscape(''),
      csvEscape(''),
      csvEscape(centsToDecimal(totals.transferTotal, 'usd')),
      csvEscape(centsToDecimal(totals.chargeTotal, 'usd')),
      csvEscape(centsToDecimal(totals.fee, 'usd')),
      csvEscape(''),
      csvEscape(''),
      csvEscape(centsToDecimal(totals.revenue, 'usd'))
    ]
    lines.push(totalLine.join(','))
  }
  return lines.join('\n') + '\n'
}

export async function writePayoutsExtraAndSummary(
  year: number,
  start: number,
  end: number,
  outDir: string,
  totals: BuildTotals
) {
  ensureDir(outDir)

  const payouts = await listPayoutsForRange(start, end)
  const payoutsByCurrency = new Map<string, number>()
  for (const p of payouts) {
    const cur = (p?.currency || '').toUpperCase()
    const amt = typeof p?.amount === 'number' ? p.amount : 0
    if (!cur) continue
    payoutsByCurrency.set(cur, (payoutsByCurrency.get(cur) || 0) + amt)
  }

  // Aggregate balance transaction fees per currency
  const btCurrencyAgg = new Map<string, number>()
  {
    let starting_after: string | undefined = undefined
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const page: any = await stripe.balanceTransactions.list({
        limit: 100,
        starting_after,
        created: { gte: start, lt: end }
      })
      if (page && Array.isArray(page.data)) {
        for (const bt of page.data) {
          const cur = (bt?.currency || '').toUpperCase()
          const fee = typeof bt?.fee === 'number' ? bt.fee : 0
          if (!cur || !fee) continue
          btCurrencyAgg.set(cur, (btCurrencyAgg.get(cur) || 0) + fee)
        }
      }
      if (!page?.has_more || page.data.length === 0) break
      starting_after = page.data[page.data.length - 1].id
    }
  }

  const extraFeesByCurrency = new Map<string, number>()
  for (const [cur, feeSum] of btCurrencyAgg.entries()) {
    if (cur === 'USD') {
      const delta = Math.max(0, feeSum - totals.fee)
      extraFeesByCurrency.set(cur, delta)
    } else {
      extraFeesByCurrency.set(cur, feeSum)
    }
  }

  // payouts_<year>.csv
  const payoutsCsvHeaders = [
    'Payout Id',
    'Status',
    'Currency',
    'Payout Date',
    'Arrival Date',
    'Amount'
  ]
  const payoutsLines: string[] = [payoutsCsvHeaders.join(',')]
  for (const p of payouts) {
    const line = [
      csvEscape(p?.id || ''),
      csvEscape(p?.status || ''),
      csvEscape((p?.currency || '').toUpperCase()),
      csvEscape(formatDateForSheets(p?.created)),
      csvEscape(formatDateForSheets(p?.arrival_date)),
      csvEscape(
        typeof p?.amount === 'number'
          ? centsToDecimal(p.amount, (p?.currency || '').toUpperCase())
          : ''
      )
    ]
    payoutsLines.push(line.join(','))
  }
  const payoutsFile = path.join(outDir, `payouts_${year}.csv`)
  fs.writeFileSync(payoutsFile, payoutsLines.join('\n') + '\n', 'utf8')

  // extra_fees_<year>.csv
  const btHeaders = ['Balance Tx Id', 'Type', 'Currency', 'Created', 'Fee', 'Net', 'Description']
  const btLines: string[] = [btHeaders.join(',')]
  {
    let starting_after: string | undefined = undefined
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const page: any = await stripe.balanceTransactions.list({
        limit: 100,
        starting_after,
        created: { gte: start, lt: end }
      })
      if (page && Array.isArray(page.data)) {
        for (const bt of page.data) {
          const fee = typeof bt?.fee === 'number' ? bt.fee : 0
          if (!fee) continue
          const row = [
            csvEscape(bt?.id || ''),
            csvEscape(bt?.type || ''),
            csvEscape((bt?.currency || '').toUpperCase()),
            csvEscape(formatDateForSheets(bt?.created)),
            csvEscape(centsToDecimal(fee, (bt?.currency || '').toUpperCase() || 'USD')),
            csvEscape(
              typeof bt?.net === 'number'
                ? centsToDecimal(bt.net, (bt?.currency || '').toUpperCase() || 'USD')
                : ''
            ),
            csvEscape(bt?.description || '')
          ]
          btLines.push(row.join(','))
        }
      }
      if (!page?.has_more || page.data.length === 0) break
      starting_after = page.data[page.data.length - 1].id
    }
  }
  const extraFeesFile = path.join(outDir, `extra_fees_${year}.csv`)
  fs.writeFileSync(extraFeesFile, btLines.join('\n') + '\n', 'utf8')

  // summary_<year>.csv
  const payoutsUSD = payoutsByCurrency.get('USD') || 0
  const extraFeesUSD = extraFeesByCurrency.get('USD') || 0
  const netRevenueUSD = totals.revenue - payoutsUSD - extraFeesUSD
  const summaryHeaders = ['Metric', 'Currency', 'Amount']
  const summaryLines: string[] = [summaryHeaders.join(',')]
  summaryLines.push(
    ['Gross Revenue', 'USD', centsToDecimal(totals.revenue, 'USD')].map(csvEscape).join(',')
  )
  summaryLines.push(['Payouts', 'USD', centsToDecimal(payoutsUSD, 'USD')].map(csvEscape).join(','))
  summaryLines.push(
    ['Extra Fees', 'USD', centsToDecimal(extraFeesUSD, 'USD')].map(csvEscape).join(',')
  )
  summaryLines.push(
    ['Net Revenue', 'USD', centsToDecimal(netRevenueUSD, 'USD')].map(csvEscape).join(',')
  )
  for (const [cur, amt] of Array.from(payoutsByCurrency.entries()).sort()) {
    if (cur === 'USD') continue
    summaryLines.push(['Payouts', cur, centsToDecimal(amt, cur)].map(csvEscape).join(','))
  }
  for (const [cur, feeAmt] of Array.from(extraFeesByCurrency.entries()).sort()) {
    if (cur === 'USD') continue
    summaryLines.push(['Extra Fees', cur, centsToDecimal(feeAmt, cur)].map(csvEscape).join(','))
  }
  const summaryFile = path.join(outDir, `summary_${year}.csv`)
  fs.writeFileSync(summaryFile, summaryLines.join('\n') + '\n', 'utf8')

  // Optional XLSX workbook
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const XLSX = require('xlsx')
    const wb = XLSX.utils.book_new()
    const toSheet = (csvStr: string) =>
      csvStr
        .trim()
        .split(/\n/)
        .map((l: string) => l.split(','))
    const wsRevenue = XLSX.utils.aoa_to_sheet(
      toSheet(fs.readFileSync(path.join(outDir, `revenue_${year}.csv`), 'utf8'))
    )
    const wsPayouts = XLSX.utils.aoa_to_sheet(toSheet(payoutsLines.join('\n')))
    const wsFees = XLSX.utils.aoa_to_sheet(toSheet(btLines.join('\n')))
    const wsSummary = XLSX.utils.aoa_to_sheet(toSheet(summaryLines.join('\n')))
    XLSX.utils.book_append_sheet(wb, wsRevenue, 'Revenue')
    XLSX.utils.book_append_sheet(wb, wsPayouts, 'Payouts')
    XLSX.utils.book_append_sheet(wb, wsFees, 'ExtraFees')
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary')
    const xlsxFile = path.join(outDir, `revenue_${year}.xlsx`)
    XLSX.writeFile(wb, xlsxFile)
  } catch {
    // xlsx not available
  }
}
