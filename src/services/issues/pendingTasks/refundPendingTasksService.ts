import moment from 'moment'
import Models from '../../../models'
import PaymentMail from '../../../mail/payment'
import { refundStripePayment } from '../../payments/refunds/refundStripePayment'
import { refundPaypalPayment } from '../../payments/refunds/refundPaypalPayment'
import { refundWalletPayment } from '../../payments/refunds/refundWalletPayment'

const models = Models as any

export interface RefundOrderResult {
  orderId: number | null
  taskId: number
  provider: string
  status: 'refunded' | 'failed' | 'skipped'
  error?: string
  reason?: string
}

export interface RefundPendingTasksResult {
  refunded: number
  failed: number
  skipped: number
  results: RefundOrderResult[]
}

export async function refundPendingTasksService(
  pendingTasks: any[]
): Promise<RefundPendingTasksResult> {
  const eligibleTasks = pendingTasks.filter((t: any) => t.action === 'eligible_for_refund')

  let refunded = 0
  let failed = 0
  let skipped = 0
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
      continue
    }

    const ageDays = task.createdAt
      ? Math.floor(moment().diff(moment(task.createdAt), 'days'))
      : null

    for (const order of paidOrders) {
      const provider = String(order.provider || '').toLowerCase()

      try {
        if (provider === 'stripe') {
          await refundStripePayment({ orderId: order.id, reason: 'old_open_bounty', ageDays })
          const user = await models.User.findByPk(order.userId)
          if (user) {
            await PaymentMail.pendingBountyRefunded(user, task, order)
          }
          results.push({ orderId: order.id, taskId: task.id, provider, status: 'refunded' })
          refunded++
        } else if (provider === 'paypal') {
          await refundPaypalPayment({
            orderId: order.id,
            reason: 'old_open_bounty',
            ageDays,
            fallbackToPayoutOnTimeLimit: false
          })
          const user = await models.User.findByPk(order.userId)
          if (user) {
            await PaymentMail.pendingBountyRefunded(user, task, order)
          }
          results.push({ orderId: order.id, taskId: task.id, provider, status: 'refunded' })
          refunded++
        } else if (provider === 'wallet') {
          await refundWalletPayment({ orderId: order.id, reason: 'old_open_bounty', ageDays })
          const user = await models.User.findByPk(order.userId)
          if (user) {
            await PaymentMail.pendingBountyRefunded(user, task, order)
          }
          results.push({ orderId: order.id, taskId: task.id, provider, status: 'refunded' })
          refunded++
        } else {
          results.push({
            orderId: order.id,
            taskId: task.id,
            provider,
            status: 'skipped',
            reason: `unknown provider "${provider}"`
          })
          skipped++
        }
      } catch (err: any) {
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
  }

  return { refunded, failed, skipped, results }
}
