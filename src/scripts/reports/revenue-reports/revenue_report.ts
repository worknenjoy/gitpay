/*
  Revenue Report by Transfers and Charges (modularized)
  - Builds the main revenue CSV for a given year
  - Writes separate CSVs for Payouts and Extra Fees, plus a Summary
  - Optionally generates a single XLSX workbook with separate sheets
*/

import fs from 'fs'
import path from 'path'
import { ensureDir } from './lib/format'
import { rowsToCSV, writePayoutsExtraAndSummary } from './lib/exporters'
import { buildRowsForYear } from './lib/reportBuilder'

function readArg(names: string[]): string | null {
  const withEq = process.argv.find((a) => names.some((n) => a.startsWith(`${n}=`)))
  if (withEq) return withEq.split('=')[1]
  const idx = process.argv.findIndex((a) => names.includes(a))
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
// The rest of the logic has been modularized into lib/* modules above.

async function main() {
  const year = getYearFromArgs()
  const start = Math.floor(Date.UTC(year, 0, 1, 0, 0, 0) / 1000)
  const end = Math.floor(Date.UTC(year + 1, 0, 1, 0, 0, 0) / 1000)

  const { rows, totals } = await buildRowsForYear(start, end)
  console.log(`Prepared ${rows.length} rows`)

  const csv = rowsToCSV(rows, totals)
  const outDir = path.resolve(process.cwd(), 'tmp', 'reports')
  const outFile = path.join(outDir, `revenue_${year}.csv`)
  ensureDir(outDir)
  fs.writeFileSync(outFile, csv, 'utf8')

  await writePayoutsExtraAndSummary(year, start, end, outDir, totals)

  console.log(`Report written to: ${outFile}`)
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Error generating revenue report:', err?.message || err)
    process.exit(1)
  })
}
