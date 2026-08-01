import Models from '../../../models'
import PaymentMail from '../../../mail/payment'
import { calculateAmountWithPercent } from '../../../utils'
import stripeModule from '../../../client/payment/stripe'
import { updateOrderAsRefunded } from '../../../mutations/order/updateOrderAsRefunded'

const models = Models as any
const stripe = stripeModule()

export type RefundStripePaymentReason = 'old_open_bounty'

type RefundStripePaymentParams = {
  orderId: number
  reason?: RefundStripePaymentReason
  ageDays?: number | null
  olderThanDays?: number
}

export async function refundStripePayment({
  orderId,
  reason,
  ageDays,
  olderThanDays
}: RefundStripePaymentParams) {
  const order = await models.Order.findByPk(orderId, {
    include: [models.User, models.Task]
  })

  if (!order) {
    throw new Error('order_not_found')
  }

  if (String(order.provider).toLowerCase() !== 'stripe') {
    throw new Error('invalid_provider')
  }

  if (order.status === 'refunded') {
    return order.dataValues ?? order
  }

  const refundAmountExcludingFees = calculateAmountWithPercent(order.amount, 0, 'decimal').centavos

  const refund = await stripe.refunds.create({
    charge: order.source,
    amount: refundAmountExcludingFees
  })

  if (!refund?.id) {
    throw new Error('stripe_refund_failed')
  }

  // Resolve sponsor before update — order.userId is the source of truth (association can be null
  // if the User row was deleted or the join did not load).
  const userId =
    order.get?.('userId') ?? order.userId ?? order.dataValues?.userId ?? null
  const taskId =
    order.get?.('TaskId') ?? order.TaskId ?? order.dataValues?.TaskId ?? null

  const updateResult = await updateOrderAsRefunded({ id: order.id }, { refund_id: refund.id })

  const orderData = updateResult[1]?.[0]?.dataValues ?? updateResult[1]?.[0] ?? order.dataValues

  // Mail must not fail the refund: Stripe + order are already updated.
  try {
    // Always re-fetch by PK — do not rely only on order.User (LEFT JOIN can be null with orphan FK)
    const user =
      (userId != null ? await models.User.findByPk(userId) : null) || order.User || null
    const task =
      (taskId != null ? await models.Task.findByPk(taskId) : null) || order.Task || null

    if (!user) {
      console.warn(
        `refundStripePayment: User row not found for order ${order.id} ` +
          `(order.userId=${userId}, association loaded=${Boolean(order.User)}). ` +
          `Refund already applied in Stripe/DB; skipping emails.`
      )
    } else if (!user.email) {
      console.warn(
        `refundStripePayment: user ${user.id} has no email for order ${order.id}; skipping emails`
      )
    } else {
      // Regular refund notice (same family as charge.refunded / manual refunds)
      await PaymentMail.refund(user, task, orderData)

      // Extra email explaining old/stale bounty policy when applicable
      if (reason === 'old_open_bounty') {
        await PaymentMail.oldBountyPaypalRefunded(user, task, orderData, {
          ageDays: ageDays ?? null,
          olderThanDays: olderThanDays ?? 365,
          returnMethod: 'refund'
        })
      }
    }
  } catch (mailErr) {
    console.error(
      `refundStripePayment: refund succeeded for order ${order.id} but mail failed:`,
      mailErr
    )
  }

  return orderData
}
