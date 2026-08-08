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
  forceClosed: number
  results: RefundOrderResult[]
}

export interface RefundPendingTasksOptions {
  /**
   * When true, close remaining pending tasks (and settle their paid orders).
   * Amount is retained by the platform — no refund, no manual-refund path.
   */
  force?: boolean
  /**
   * When false, skip payment refunds and only force-close pending tasks (requires force).
   * Defaults to true.
   */
  attemptRefund?: boolean
}

/** Task comment used when force-closing pending tasks for platform retention. */
export const FORCE_CLOSE_COMMENT = 'nobody requested the transfer'

/**
 * Order status after force-close. Not `succeeded` (would look like active funding)
 * and not `refunded` (money was not returned). Amount stays with the platform.
 */
export const FORCE_CLOSE_ORDER_STATUS = 'closed'

/** Order comment: bounty closed; funds kept by the platform (not refunded). */
export function buildForceCloseOrderComment(): string {
  return (
    `closed [${new Date().toISOString()}]: amount retained by platform — ${FORCE_CLOSE_COMMENT}`
  )
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

const isPaidSucceededOrder = (o: any) => o?.paid === true && o?.status === 'succeeded'

/**
 * Close a pending task and settle its paid orders for platform retention.
 * No refund is issued — amount stays with the platform.
 *
 * Orders leave `succeeded` so state sync / funded queries no longer treat them
 * as active funding (see findNewFundedIssues: status succeeded + paid).
 */
async function forceCloseTask(
  task: any,
  results: RefundOrderResult[]
): Promise<'closed' | 'failed'> {
  try {
    let orders: any[] = task.Orders ?? []
    if (!orders.length) {
      orders = await models.Order.findAll({ where: { TaskId: task.id } })
    }

    const paidOrders = orders.filter(isPaidSucceededOrder)
    const orderComment = buildForceCloseOrderComment()

    for (const order of paidOrders) {
      const provider = String(order.provider || 'n/a').toLowerCase()
      // paid stays true (payment was collected); status leaves succeeded so
      // findNewFundedIssues / reports of open bounties no longer match these.
      await models.Order.update(
        {
          status: FORCE_CLOSE_ORDER_STATUS,
          paid: true,
          comment: orderComment
        },
        { where: { id: order.id } }
      )
      results.push({
        orderId: order.id,
        taskId: task.id,
        provider,
        status: 'closed',
        reason: 'order closed — amount retained by platform'
      })
    }

    await markIssueStateAsClosed(task.id, FORCE_CLOSE_COMMENT, ClosedReasons.MANUAL)
    results.push({
      orderId: null,
      taskId: task.id,
      provider: 'n/a',
      status: 'closed',
      reason: `force closed — ${FORCE_CLOSE_COMMENT}; amount retained by platform`
    })
    return 'closed'
  } catch (err: any) {
    results.push({
      orderId: null,
      taskId: task.id,
      provider: 'n/a',
      status: 'failed',
      error: err?.message || String(err)
    })
    return 'failed'
  }
}

export async function refundPendingTasksService(
  pendingTasks: any[],
  options: RefundPendingTasksOptions = {}
): Promise<RefundPendingTasksResult> {
  const force = options.force === true
  const attemptRefund = options.attemptRefund !== false

  let refunded = 0
  let failed = 0
  let skipped = 0
  let closed = 0
  let forceClosed = 0
  const results: RefundOrderResult[] = []

  // Force-only path (npm run issues:pending -- --force):
  // close all remaining pending tasks; amount retained by platform
  if (force && !attemptRefund) {
    for (const task of pendingTasks) {
      const outcome = await forceCloseTask(task, results)
      if (outcome === 'closed') {
        closed++
        forceClosed++
      } else {
        failed++
      }
    }
    return { refunded, failed, skipped, closed, forceClosed, results }
  }

  const eligibleTasks = pendingTasks.filter((t: any) => isRefundEligibleAction(t.action))

  for (const task of eligibleTasks) {
    const paidOrders: any[] = (task.Orders ?? []).filter(isPaidSucceededOrder)

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
        if (force) {
          const outcome = await forceCloseTask(task, results)
          if (outcome === 'closed') {
            closed++
            forceClosed++
          } else {
            failed++
          }
        } else {
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
        if (force) {
          const outcome = await forceCloseTask(task, results)
          if (outcome === 'closed') {
            closed++
            forceClosed++
          } else {
            failed++
          }
        } else {
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
    } else if (force && taskRefundFailed) {
      // Failed refunds: close task + settle orders; amount retained by platform
      const outcome = await forceCloseTask(task, results)
      if (outcome === 'closed') {
        closed++
        forceClosed++
      } else {
        failed++
      }
    }
  }

  return { refunded, failed, skipped, closed, forceClosed, results }
}
