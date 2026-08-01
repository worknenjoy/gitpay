/* eslint-disable no-console */
/**
 * Process deferred Whop settlements and (optionally) emulate the full pay → transfer → payout path.
 *
 * Same transfer logic as the daily cron, plus ops flags for sandbox where funds never become available.
 *
 * Usage:
 *   npm run scripts:payment-request:process_pending_transfers
 *   npm run scripts:payment-request:process_pending_transfers -- --mock-settlement
 *   npm run scripts:payment-request:process_pending_transfers -- --mock-settlement --bounty-orders
 *   npm run scripts:payment-request:process_pending_transfers -- --mock-settlement --bounty-transfers --task-id=12
 *   npm run scripts:payment-request:process_pending_transfers -- --mock-payout --user-id=3 --amount=50
 *
 * Flags:
 *   --mock-settlement          Skip live Whop ledger transfers; write mock transfer ids in Gitpay
 *   --payment-request-payment-id=N   Only one PaymentRequestPayment
 *   --bounty-orders            Mark unpaid Whop bounty Orders as paid (emulate payment.succeeded)
 *   --order-id=N               Limit bounty-orders to one Order
 *   --bounty-transfers         Run assignee transfers for paid Whop-funded tasks (uses transferBuildsService)
 *   --task-id=N                Limit bounty-transfers to one Task
 *   --mock-payout              Create/complete a mock Whop withdrawal (no bank call)
 *   --user-id=N                User for --mock-payout (required with --mock-payout)
 *   --amount=N                 Payout amount in major units (optional; marks pending payouts if omitted)
 *   --payout-id=N              Mark an existing Payout as paid
 *   --help
 *
 * See docs/payments-providers.md → "Sandbox: emulating Whop settlement & payout".
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { i18nConfigure } from '../../shared/i18n/i18n'
import { processPendingPaymentRequestTransfers } from '../../services/paymentRequest/processPendingPaymentRequestTransfers'
import { processUnpaidWhopBountyOrders } from '../../services/orders/markBountyOrderPaid'
import { processPendingBountyWhopTransfers } from '../../services/orders/processPendingBountyWhopTransfers'
import { mockPayoutSettlement } from '../../services/payouts/mockPayoutSettlement'

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
Whop / payment-request settlement script

Payment requests (platform → seller company):
  npm run scripts:payment-request:process_pending_transfers
  npm run scripts:payment-request:process_pending_transfers -- --mock-settlement

Bounty orders (emulate payment.succeeded):
  npm run scripts:payment-request:process_pending_transfers -- --bounty-orders
  npm run scripts:payment-request:process_pending_transfers -- --bounty-orders --order-id=42

Bounty assignee transfers (platform → assignee company):
  npm run scripts:payment-request:process_pending_transfers -- --bounty-transfers --mock-settlement
  npm run scripts:payment-request:process_pending_transfers -- --bounty-transfers --task-id=12 --mock-settlement

Mock final payout (seller → bank, Gitpay only):
  npm run scripts:payment-request:process_pending_transfers -- --mock-payout --user-id=3 --amount=50

Full sandbox path example:
  1) Customer pays on Whop (or --bounty-orders for open orders)
  2) --mock-settlement          # PR transfer when available balance never settles
  3) --bounty-transfers --mock-settlement
  4) --mock-payout --user-id=… --amount=…
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

  const mockSettlement = flags.has('mock-settlement')
  const runBountyOrders = flags.has('bounty-orders')
  const runBountyTransfers = flags.has('bounty-transfers')
  const runMockPayout = flags.has('mock-payout')
  // Run PR transfer batch by default; skip when the user only asked for bounty/payout ops
  // (unless they also pass --mock-settlement, --pr-transfers, or --all).
  const onlySecondaryOps =
    (runBountyOrders || runBountyTransfers || runMockPayout) &&
    !mockSettlement &&
    !flags.has('pr-transfers') &&
    !flags.has('all')
  const shouldRunPr = !onlySecondaryOps || flags.has('pr-transfers') || flags.has('all')

  console.log('Starting Whop / payment-request settlement processing...')
  console.log(`PAYMENT_PROVIDER=${process.env.PAYMENT_PROVIDER || 'stripe'}`)
  console.log(
    `Flags: mock-settlement=${mockSettlement} bounty-orders=${runBountyOrders} bounty-transfers=${runBountyTransfers} mock-payout=${runMockPayout}`
  )

  let failed = 0

  if (shouldRunPr) {
    console.log('\n--- Payment request transfers ---')
    const paymentRequestPaymentId = values['payment-request-payment-id']
      ? Number(values['payment-request-payment-id'])
      : undefined

    const result = await processPendingPaymentRequestTransfers({
      mockSettlement,
      paymentRequestPaymentId: Number.isFinite(paymentRequestPaymentId as number)
        ? paymentRequestPaymentId
        : undefined
    })

    console.log('Results:')
    console.log(`  Scanned:       ${result.scanned}`)
    console.log(`  Transferred:   ${result.transferred}`)
    console.log(`  Still pending: ${result.deferred}`)
    console.log(`  Skipped:       ${result.skipped}`)
    console.log(`  Failed:        ${result.failed}`)
    console.log(`  Mock settle:   ${result.mockSettlement}`)

    if (result.errors.length) {
      console.log('Errors:')
      for (const err of result.errors) {
        console.log(`  - payment ${err.paymentRequestPaymentId}: ${err.error}`)
      }
    }
    failed += result.failed
  }

  if (runBountyOrders) {
    console.log('\n--- Bounty orders (emulate payment.succeeded) ---')
    const orderId = values['order-id'] ? Number(values['order-id']) : undefined
    const orderResult = await processUnpaidWhopBountyOrders({
      orderId: Number.isFinite(orderId as number) ? orderId : undefined,
      silent: false
    })
    console.log(`  Scanned: ${orderResult.scanned}`)
    console.log(`  Paid:    ${orderResult.paid}`)
    console.log(`  Skipped: ${orderResult.skipped}`)
    console.log(`  Failed:  ${orderResult.failed}`)
    for (const o of orderResult.orders) {
      console.log(`  - order ${o.orderId} source=${o.source}`)
    }
    for (const err of orderResult.errors) {
      console.log(`  - order ${err.orderId}: ${err.error}`)
    }
    failed += orderResult.failed
  }

  if (runBountyTransfers) {
    console.log('\n--- Bounty assignee transfers ---')
    const taskId = values['task-id'] ? Number(values['task-id']) : undefined
    const bountyResult = await processPendingBountyWhopTransfers({
      mockSettlement,
      taskId: Number.isFinite(taskId as number) ? taskId : undefined
    })
    console.log(`  Scanned:     ${bountyResult.scanned}`)
    console.log(`  Transferred: ${bountyResult.transferred}`)
    console.log(`  Skipped:     ${bountyResult.skipped}`)
    console.log(`  Failed:      ${bountyResult.failed}`)
    console.log(`  Mock settle: ${bountyResult.mockSettlement}`)
    for (const err of bountyResult.errors) {
      console.log(`  - task ${err.taskId}: ${err.error}`)
    }
    failed += bountyResult.failed
  }

  if (runMockPayout) {
    console.log('\n--- Mock payout (withdrawal) ---')
    const userId = values['user-id'] ? Number(values['user-id']) : NaN
    if (!Number.isFinite(userId)) {
      console.error('--mock-payout requires --user-id=N')
      process.exitCode = 1
      return
    }
    const amount = values.amount != null ? Number(values.amount) : undefined
    const payoutId = values['payout-id'] ? Number(values['payout-id']) : undefined
    try {
      const payoutResult = await mockPayoutSettlement({
        userId,
        amount: Number.isFinite(amount as number) ? amount : undefined,
        payoutId: Number.isFinite(payoutId as number) ? payoutId : undefined,
        currency: values.currency || 'usd'
      })
      console.log(`  Created: ${payoutResult.created}`)
      console.log(`  Updated: ${payoutResult.updated}`)
      console.log(
        `  Payout:  id=${payoutResult.payout.id} status=${payoutResult.payout.status} amount=${payoutResult.payout.amount}`
      )
    } catch (error: any) {
      console.error(`  Failed: ${error?.message || error}`)
      failed += 1
    }
  }

  if (failed > 0) {
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error('Settlement processing failed:', err)
  process.exit(1)
})
