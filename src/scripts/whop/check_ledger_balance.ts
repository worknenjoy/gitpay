/* eslint-disable no-console */
/**
 * Print the platform's current Whop ledger balance (available / pending / reserve).
 *
 * Used to verify, against a real Whop sandbox refund, whether Whop returns its own
 * processing fee on refund. Run once before and once after issuing a real refund for
 * a known payment, then compare the drop in `available` against that payment's
 * amount_after_fees (what the platform actually received) vs its gross amount (what
 * the customer gets back) — see the "Verify Whop's real refund-fee behavior" plan.
 *
 * Usage:
 *   npx tsx src/scripts/whop/check_ledger_balance.ts
 *   npx tsx src/scripts/whop/check_ledger_balance.ts biz_xxx   (override WHOP_COMPANY_ID)
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { WhopPaymentProvider } from '../../providers/whop/WhopPaymentProvider'

async function main() {
  const companyId = process.argv[2] || process.env.WHOP_COMPANY_ID

  if (!process.env.WHOP_API_KEY) {
    console.error('WHOP_API_KEY is not set')
    process.exit(1)
  }
  if (!companyId) {
    console.error('WHOP_COMPANY_ID is not set and no company id was passed as an argument')
    process.exit(1)
  }

  const provider = WhopPaymentProvider.getInstance()
  const ledger = await provider.getCompanyLedgerBalances(companyId)

  console.log(`[${new Date().toISOString()}] Ledger balance for ${companyId}`)
  console.log('ledgerId:', ledger.ledgerId)
  console.log('available:', ledger.available)
  console.log('pending:', ledger.pending)
  console.log('reserve:', ledger.reserve)
  console.log('\nraw:', JSON.stringify(ledger.raw, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
