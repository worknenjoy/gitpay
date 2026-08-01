import moment from 'moment'
import { refundStripePayment } from '../../payments/refunds/refundStripePayment'
import { refundPaypalPayment } from '../../payments/refunds/refundPaypalPayment'
import { refundWalletPayment } from '../../payments/refunds/refundWalletPayment'
import { markIssueStateAsClosed } from '../../../mutations/issue/state/markIssueStateAsClosed'
import { ClosedReasons } from '../../../constants/task'
import { isRefundEligibleAction } from '../../../queries/issue/state/findPendingTasks'
import PaymentMail from '../../../mail/payment'
import Models from '../../../models'

const models = Models as any

const MANUAL_REFUND_CONTACT = 'contact@gitpay.me'

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

/** Best-effort extraction of a readable refund failure reason (esp. PayPal API bodies). */
export function extractRefundFailureReason(err: any): string {
  if (!err) return 'unknown_error'

  const tryParse = (input: unknown): any => {
    if (typeof input === 'string') {
      try {
        return JSON.parse(input)
      } catch {
        return null
      }
    }
    return input && typeof input === 'object' ? input : null
  }

  const body = tryParse(err?.error) ?? tryParse(err?.response?.body) ?? tryParse(err?.body)
  const detail = body?.details?.[0]
  if (detail?.issue) {
    const description = detail.description || body?.message
    return description ? `${detail.issue}: ${description}` : String(detail.issue)
  }
  if (body?.name && body?.message) {
    return `${body.name}: ${body.message}`
  }
  if (body?.message) {
    return String(body.message)
  }

  if (err?.message && String(err.message).trim()) {
    return String(err.message)
  }

  return String(err)
}

function buildRefundFailedComment(provider: string, reason: string): string {
  return (
    `${provider} refund failed [${new Date().toISOString()}]: ${reason}. ` +
    `Manual refund required — user should contact ${MANUAL_REFUND_CONTACT}`
  )
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
        const reason = extractRefundFailureReason(err)

        // Keep order.status as-is (e.g. succeeded). Only record failure on comment.
        try {
          await models.Order.update(
            { comment: buildRefundFailedComment(provider, reason) },
            { where: { id: order.id } }
          )
        } catch {
          // secondary failure — ignore, primary error is captured in results
        }

        // PayPal-only: notify payer that auto-refund failed and they need a manual refund.
        if (provider === 'paypal') {
          try {
            const userId =
              order.userId ?? order.get?.('userId') ?? order.dataValues?.userId ?? null
            const user =
              order.User ||
              (userId != null ? await models.User.findByPk(userId) : null)
            const taskForMail =
              order.Task ||
              task ||
              (order.TaskId != null ? await models.Task.findByPk(order.TaskId) : null)

            if (user) {
              await PaymentMail.paypalRefundFailed(user, taskForMail, order, { reason })
            } else {
              console.warn(
                `refundPendingTasksService: no user for PayPal order ${order.id}; skipped refund-failed email`
              )
            }
          } catch (mailErr) {
            console.error(
              `refundPendingTasksService: paypalRefundFailed mail failed for order ${order.id}:`,
              mailErr
            )
          }
        }

        results.push({
          orderId: order.id,
          taskId: task.id,
          provider,
          status: 'failed',
          error: reason
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
