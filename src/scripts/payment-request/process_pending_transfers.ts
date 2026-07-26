/* eslint-disable no-console */
/**
 * Manually run the pending payment-request transfer job (same logic as the daily cron).
 *
 * Usage:
 *   npm run scripts:payment-request:process_pending_transfers
 *   tsx src/scripts/payment-request/process_pending_transfers.ts
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { processPendingPaymentRequestTransfers } from '../../services/paymentRequest/processPendingPaymentRequestTransfers'

async function main() {
  console.log('Starting pending payment-request transfer processing...')
  console.log(`PAYMENT_PROVIDER=${process.env.PAYMENT_PROVIDER || 'stripe'}`)
  const result = await processPendingPaymentRequestTransfers()

  console.log('\nResults:')
  console.log(`  Scanned:      ${result.scanned}`)
  console.log(`  Transferred:  ${result.transferred}`)
  console.log(`  Still pending:${result.deferred}`)
  console.log(`  Skipped:      ${result.skipped}`)
  console.log(`  Failed:       ${result.failed}`)

  if (result.errors.length) {
    console.log('\nErrors:')
    for (const err of result.errors) {
      console.log(`  - payment ${err.paymentRequestPaymentId}: ${err.error}`)
    }
  }

  if (result.failed > 0) {
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error('Pending transfer processing failed:', err)
  process.exit(1)
})
