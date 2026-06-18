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
}

export async function refundStripePayment({ orderId, reason, ageDays }: RefundStripePaymentParams) {
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

  const updateResult = await updateOrderAsRefunded({ id: order.id }, { refund_id: refund.id })

  const orderData = updateResult[1]?.[0]?.dataValues ?? updateResult[1]?.[0] ?? order.dataValues

  const user = order.User || (await models.User.findByPk(orderData.userId))
  const task = order.Task || (await models.Task.findByPk(orderData.TaskId))

  await PaymentMail.refund(user, task, orderData)

  return orderData
}
