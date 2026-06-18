import moment from 'moment'
import Models from '../../../models'
import PaymentMail from '../../../mail/payment'
import { refundStripePayment } from '../../../services/payments/refunds/refundStripePayment'
import { refundPaypalPayment } from '../../../services/payments/refunds/refundPaypalPayment'
import { C } from './list'

const models = Models as any

export async function refundPendingTasks(
  pendingTasks: any[]
) {
  const eligibleTasks = pendingTasks.filter((t: any) => t.action === 'eligible_for_refund')

  console.log(
    `\n${C.cyan}${C.bold}💸 [Refund] Processing ${eligibleTasks.length} eligible task(s) for refund...${C.reset}`
  )

  let refunded = 0
  let failed = 0
  let skipped = 0

  for (const task of eligibleTasks) {
    const paidOrders: any[] = (task.Orders ?? []).filter(
      (o: any) => o.paid === true && o.status === 'succeeded'
    )

    if (paidOrders.length === 0) {
      console.log(`${C.gray}  Task #${task.id}: no paid orders to refund, skipping.${C.reset}`)
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
          await refundStripePayment({
            orderId: order.id,
            reason: 'old_open_bounty',
            ageDays
          })

          const user = await models.User.findByPk(order.userId)
          if (user) {
            await PaymentMail.pendingBountyRefunded(user, task, order)
          }

          console.log(
            `${C.green}  ✓ Task #${task.id} Order #${order.id} (stripe): refunded.${C.reset}`
          )
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

          console.log(
            `${C.green}  ✓ Task #${task.id} Order #${order.id} (paypal): refunded.${C.reset}`
          )
          refunded++
        } else {
          console.log(
            `${C.gray}  Task #${task.id} Order #${order.id} (${provider}): not eligible for automated refund, skipping.${C.reset}`
          )
          skipped++
        }
      } catch (err: any) {
        const message = err?.message || String(err)
        console.error(
          `${C.red}  ✗ Task #${task.id} Order #${order.id} (${provider}): refund failed — ${message}${C.reset}`
        )

        // For PayPal failures, record the error on the order so operators can identify manual refund candidates.
        if (provider === 'paypal') {
          try {
            await models.Order.update(
              {
                comment: `PayPal refund failed [${new Date().toISOString()}]: ${message}`
              },
              { where: { id: order.id } }
            )
          } catch (updateErr) {
            console.error(
              `${C.red}    Failed to save error comment on order #${order.id}:${C.reset}`,
              updateErr
            )
          }
        }

        failed++
      }
    }
  }

  console.log(
    `\n${C.bold}[Refund] Done — refunded: ${refunded}, failed: ${failed}, skipped: ${skipped}${C.reset}`
  )
}
