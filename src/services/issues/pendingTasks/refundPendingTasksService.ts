import moment from 'moment'
import { refundStripePayment } from '../../payments/refunds/refundStripePayment'
import { refundPaypalPayment } from '../../payments/refunds/refundPaypalPayment'
import { refundWalletPayment } from '../../payments/refunds/refundWalletPayment'
import { markIssueStateAsClosed } from '../../../mutations/issue/state/markIssueStateAsClosed'
import { ClosedReasons } from '../../../constants/task'
import { isRefundEligibleAction } from '../../../queries/issue/state/findPendingTasks'
import Models from '../../../models'

const models = Models as any

export interface RefundOrderResult {
  orderId: number | null
  taskId: number
  provider: string
  status: 'refunded' | 'failed' | 'skipped' | 'closed'
  error?: string
  reason?: string
}

export interface RefundPendingTasksResult {
  refunded: number
  failed: number
  skipped: number
  closed: number
  results: RefundOrderResult[]
}

export async function refundPendingTasksService(
  pendingTasks: any[]
): Promise<RefundPendingTasksResult> {
  const eligibleTasks = pendingTasks.filter((t: any) => isRefundEligibleAction(t.action))

  let refunded = 0
  let failed = 0
  let skipped = 0
  let closed = 0
  const results: RefundOrderResult[] = []

  for (const task of eligibleTasks) {
    const paidOrders: any[] = (task.Orders ?? []).filter(
      (o: any) => o.paid === true && o.status === 'succeeded'
    )

    if (paidOrders.length === 0) {
      results.push({
        orderId: null,
        taskId: task.id,
        provider: 'n/a',
        status: 'skipped',
        reason: 'no qualifying paid orders'
      })
      skipped++
      // Still try to close if nothing left to refund so task leaves pending list
      try {
        await markIssueStateAsClosed(
          task.id,
          'closed pending task with no remaining paid orders',
          ClosedReasons.REFUNDED
        )
        results.push({
          orderId: null,
          taskId: task.id,
          provider: 'n/a',
          status: 'closed',
          reason: 'state closed (no paid orders)'
        })
        closed++
      } catch (err: any) {
        results.push({
          orderId: null,
          taskId: task.id,
          provider: 'n/a',
          status: 'failed',
          error: err?.message || String(err)
        })
        failed++
      }
      continue
    }

    const ageDays = task.createdAt
      ? Math.floor(moment().diff(moment(task.createdAt), 'days'))
      : null

    let taskRefundFailed = false
    let taskRefundedCount = 0

    for (const order of paidOrders) {
      const provider = String(order.provider || '').toLowerCase()

      try {
        // Helpers always send PaymentMail.refund; with reason old_open_bounty they also send
        // PaymentMail.oldBountyPaypalRefunded (policy/reason). Stripe charge.refunded webhook
        // may still send its own notice independently.
        if (provider === 'stripe') {
          await refundStripePayment({ orderId: order.id, reason: 'old_open_bounty', ageDays })
          results.push({ orderId: order.id, taskId: task.id, provider, status: 'refunded' })
          refunded++
          taskRefundedCount++
        } else if (provider === 'paypal') {
          await refundPaypalPayment({
            orderId: order.id,
            reason: 'old_open_bounty',
            ageDays,
            fallbackToPayoutOnTimeLimit: false
          })
          results.push({ orderId: order.id, taskId: task.id, provider, status: 'refunded' })
          refunded++
          taskRefundedCount++
        } else if (provider === 'wallet') {
          await refundWalletPayment({ orderId: order.id, reason: 'old_open_bounty', ageDays })
          results.push({ orderId: order.id, taskId: task.id, provider, status: 'refunded' })
          refunded++
          taskRefundedCount++
        } else {
          results.push({
            orderId: order.id,
            taskId: task.id,
            provider,
            status: 'skipped',
            reason: `unknown provider "${provider}"`
          })
          skipped++
          taskRefundFailed = true
        }
      } catch (err: any) {
        taskRefundFailed = true
        const message = err?.message || String(err)

        try {
          await models.Order.update(
            {
              comment: `${provider} refund failed [${new Date().toISOString()}]: ${message}`
            },
            { where: { id: order.id } }
          )
        } catch {
          // secondary failure — ignore, primary error is captured in results
        }

        results.push({
          orderId: order.id,
          taskId: task.id,
          provider,
          status: 'failed',
          error: message
        })
        failed++
      }
    }

    // Only close when every paid order refunded successfully (no fails/skips)
    if (!taskRefundFailed && taskRefundedCount === paidOrders.length) {
      try {
        await markIssueStateAsClosed(
          task.id,
          task.action === 'stale_unclaimed_eligible_for_refund'
            ? 'refunded stale unclaimed bounty (no one to claim)'
            : 'refunded pending eligible task',
          ClosedReasons.REFUNDED
        )
        results.push({
          orderId: null,
          taskId: task.id,
          provider: 'n/a',
          status: 'closed',
          reason: 'state closed after refunds'
        })
        closed++
      } catch (err: any) {
        results.push({
          orderId: null,
          taskId: task.id,
          provider: 'n/a',
          status: 'failed',
          error: err?.message || String(err)
        })
        failed++
      }
    }
  }

  return { refunded, failed, skipped, closed, results }
}
