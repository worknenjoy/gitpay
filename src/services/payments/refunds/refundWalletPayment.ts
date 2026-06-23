import Models from '../../../models'
import PaymentMail from '../../../mail/payment'
import { updateOrderAsRefunded } from '../../../mutations/order/updateOrderAsRefunded'

const models = Models as any

export type RefundWalletPaymentReason = 'old_open_bounty'

type RefundWalletPaymentParams = {
  orderId: number
  reason?: RefundWalletPaymentReason
  ageDays?: number | null
}

export async function refundWalletPayment({ orderId }: RefundWalletPaymentParams) {
  const order = await models.Order.findByPk(orderId, {
    include: [models.User, models.Task]
  })

  if (!order) {
    throw new Error('order_not_found')
  }

  if (String(order.provider).toLowerCase() !== 'wallet') {
    throw new Error('invalid_provider')
  }

  if (order.status === 'refunded') {
    return order.dataValues ?? order
  }

  const updateResult = await updateOrderAsRefunded({ id: order.id })
  const orderData = updateResult[1]?.[0]?.dataValues ?? updateResult[1]?.[0] ?? order.dataValues

  if (order.source_id) {
    await models.Wallet.findByPk(order.source_id)
  }

  const user = order.User || (await models.User.findByPk(orderData.userId))
  const task = order.Task || (await models.Task.findByPk(orderData.TaskId))

  await PaymentMail.refund(user, task, orderData)

  return orderData
}
