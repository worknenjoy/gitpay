import { i18nConfigure } from '../../shared/i18n/i18n'
import { findOldIssuesWithoutMergedPrsReport } from '../../queries/issue/pull-request/findOldIssuesWithoutMergedPrsReport'
import { refundPaypalPayment } from '../../services/payments/refunds/refundPaypalPayment'

function hasFlag(...names: string[]) {
  return process.argv.some((arg) =>
    names.some((name) => arg === name || arg.startsWith(`${name}=`))
  )
}

function printHelp() {
  console.log('Refund PayPal payments for old open bounties (> 1 year)')
  console.log('')
  console.log(
    'This script uses the existing 365-day old-bounties report and only processes PayPal orders.'
  )
  console.log('')
  console.log('Usage:')
  console.log('  npm run paypal:refund-old-open-bounties -- --execute')
  console.log('  npm run paypal:refund-old-open-bounties -- --execute --payout-on-time-limit')
  console.log('')
  console.log('Env:')
  console.log('  PAYPAL_HOST, PAYPAL_CLIENT, PAYPAL_SECRET')
  console.log('')
  console.log('Notes:')
  console.log(
    '  If PayPal returns REFUND_TIME_LIMIT_EXCEEDED, you can opt-in to sending a PayPal Payout back to the original payer (requires Payouts enabled on your PayPal app).'
  )
}

async function main() {
  i18nConfigure()

  const olderThanDays = 365
  const execute = hasFlag('--execute')
  const payoutOnTimeLimit = hasFlag('--payout-on-time-limit')

  const results = (await findOldIssuesWithoutMergedPrsReport({ olderThanDays })) as any[]

  const paypalOrders: Array<{
    orderId: number
    taskId: number
    ageDays: number | null
    issueCreatedAt?: string | null
  }> = []
  const seenOrderIds = new Set<number>()

  for (const entry of results) {
    const task = entry?.issue
    const orders = entry?.ordersByProvider?.paypal ?? []
    for (const order of orders) {
      if (!order?.id) continue
      // Refunds require a capture. We'll attempt to resolve capture ids from:
      // - order.transfer_id (stored capture id)
      // - order.source_id (PayPal checkout order id)
      // If neither exists, refundPaypalPayment will report paypal_capture_missing and we will skip.
      const orderId = Number(order.id)
      if (seenOrderIds.has(orderId)) continue
      seenOrderIds.add(orderId)
      paypalOrders.push({
        orderId,
        taskId: Number(task?.id),
        ageDays: entry?.ageDays ?? null,
        issueCreatedAt: task?.createdAt ? String(task.createdAt) : null
      })
    }
  }

  console.log(
    `Found ${paypalOrders.length} PayPal order(s) on old open bounties (> ${olderThanDays} days).`
  )

  if (!execute) {
    printHelp()
    console.log('')
    console.log(
      'Dry run only (no changes made). Pass --execute to actually refund and send emails.'
    )
    return
  }

  let ok = 0
  let failed = 0
  let skipped = 0

  for (const item of paypalOrders) {
    try {
      console.log(
        `Processing PayPal orderId=${item.orderId} taskId=${item.taskId} ageDays=${item.ageDays ?? '-'} createdAt=${item.issueCreatedAt ?? '-'}`
      )
      await refundPaypalPayment({
        orderId: item.orderId,
        reason: 'old_open_bounty',
        ageDays: item.ageDays,
        olderThanDays,
        fallbackToPayoutOnTimeLimit: payoutOnTimeLimit
      })

      // Helpful signal in logs to confirm the fallback path executed.
      // When payout fallback is used, refund_id is stored as payout:<payoutBatchId>.
      try {
        const orderAfter = await (require('../../models') as any).Order.findByPk(item.orderId)
        const refundId = orderAfter?.refund_id ? String(orderAfter.refund_id) : ''
        if (refundId.startsWith('payout:')) {
          console.log(`OrderId=${item.orderId}: returned via PayPal payout (${refundId})`)
        }
      } catch {
        // ignore
      }

      ok += 1
    } catch (err) {
      const message = (err as any)?.message
      if (message === 'paypal_capture_missing') {
        skipped += 1
        console.log(`Skipping orderId=${item.orderId}: paypal_capture_missing`)
        continue
      }
      if (message === 'paypal_payer_missing') {
        skipped += 1
        console.log(`Skipping orderId=${item.orderId}: paypal_payer_missing`)
        continue
      }
      failed += 1
      console.error(`Failed orderId=${item.orderId}:`, err)
    }
  }

  console.log(`Done. ok=${ok} skipped=${skipped} failed=${failed}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
