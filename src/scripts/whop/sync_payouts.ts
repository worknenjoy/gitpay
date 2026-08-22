/* eslint-disable no-console */
/**
 * Manually reconcile Whop Payout rows against Whop's own withdrawal history.
 *
 * Same underlying logic as the hourly payout sync cron
 * (src/crons/whop/whopPayoutSyncCron.ts), but with no time-window bound — this
 * walks a company's *entire* withdrawal history. Use this for the one-time
 * historical backfill after deploying the payout webhook fix, or anytime for
 * a full audit/resync, without waiting on or widening the cron's regular
 * bounded scope.
 *
 * Usage:
 *   npm run scripts:whop:sync_payouts -- --company-id=biz_xxx
 *   npm run scripts:whop:sync_payouts -- --all
 *   npm run scripts:whop:sync_payouts -- --all --since-days=30
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { i18nConfigure } from '../../shared/i18n/i18n'
import {
  syncWhopPayoutsForCompany,
  syncWhopPayoutsForAllCompanies
} from '../../services/whop/syncWhopPayouts'

function parseArgs(argv: string[]) {
  const flags = new Set<string>()
  const values: Record<string, string> = {}

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      flags.add('help')
      continue
    }
    if (arg.startsWith('--') && arg.includes('=')) {
      const [key, ...rest] = arg.slice(2).split('=')
      values[key] = rest.join('=')
      continue
    }
    if (arg.startsWith('--')) {
      flags.add(arg.slice(2))
    }
  }

  return { flags, values }
}

function printHelp() {
  console.log(`
Whop payout sync script — full-history reconciliation (no cron time-window bound)

  npm run scripts:whop:sync_payouts -- --company-id=biz_xxx
  npm run scripts:whop:sync_payouts -- --all
  npm run scripts:whop:sync_payouts -- --all --since-days=30

Flags:
  --company-id=biz_xxx   Sync a single connected Whop company
  --all                  Sync every connected Whop company (Users.whop_account_id set)
  --since-days=N         Optional bound: only withdrawals created in the last N days
                         (omit for the full history — this is what performs the
                         historical backfill)
  --help
`)
}

async function main() {
  // Mail templates call i18n.setLocale — must configure locales before any emails
  i18nConfigure()

  const { flags, values } = parseArgs(process.argv.slice(2))

  if (flags.has('help')) {
    printHelp()
    return
  }

  const companyId = values['company-id']
  const runAll = flags.has('all')

  if (!companyId && !runAll) {
    console.error('Pass --company-id=biz_xxx or --all')
    process.exitCode = 1
    return
  }

  const sinceDays = values['since-days'] ? Number(values['since-days']) : undefined
  const since =
    sinceDays != null && Number.isFinite(sinceDays)
      ? new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000)
      : undefined

  console.log('Starting Whop payout sync...')
  console.log(`Scope: ${runAll ? 'all connected companies' : companyId}`)
  console.log(`Window: ${since ? `since ${since.toISOString()}` : 'full history'}`)

  if (runAll) {
    const result = await syncWhopPayoutsForAllCompanies({ since })
    console.log('Results:')
    console.log(`  Companies: ${result.companies}`)
    console.log(`  Scanned:   ${result.scanned}`)
    console.log(`  Failed:    ${result.failed}`)
    if (result.errors.length) {
      console.log('Errors:')
      for (const err of result.errors) {
        console.log(`  - company ${err.companyId} withdrawal ${err.withdrawalId}: ${err.error}`)
      }
    }
    if (result.failed > 0) process.exitCode = 1
    return
  }

  const result = await syncWhopPayoutsForCompany(companyId, { since })
  console.log('Results:')
  console.log(`  Scanned: ${result.scanned}`)
  console.log(`  Failed:  ${result.failed}`)
  if (result.errors.length) {
    console.log('Errors:')
    for (const err of result.errors) {
      console.log(`  - withdrawal ${err.withdrawalId}: ${err.error}`)
    }
  }
  if (result.failed > 0) process.exitCode = 1
}

main().catch((err) => {
  console.error('Whop payout sync failed:', err)
  process.exit(1)
})
