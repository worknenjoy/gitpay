import Models from '../../../models'
import PaymentMail from '../../../mail/payment'
import { updateOrderAsRefunded } from '../../../mutations/order/updateOrderAsRefunded'

const models = Models as any

export type RefundWalletPaymentReason = 'old_open_bounty'

type RefundWalletPaymentParams = {
  orderId: number
  reason?: RefundWalletPaymentReason
  ageDays?: number | null
  olderThanDays?: number
}

export async function refundWalletPayment({
  orderId,
  reason,
  ageDays,
  olderThanDays
}: RefundWalletPaymentParams) {
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

  try {
    const userId = orderData.userId ?? order.userId
    const taskId = orderData.TaskId ?? order.TaskId
    const user = order.User || (userId != null ? await models.User.findByPk(userId) : null)
    const task = order.Task || (taskId != null ? await models.Task.findByPk(taskId) : null)

    if (!user) {
      console.warn(
        `refundWalletPayment: no user for order ${order.id} (userId=${userId}); skipping refund emails`
      )
    } else {
      await PaymentMail.refund(user, task, orderData)

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
      `refundWalletPayment: refund succeeded for order ${order.id} but mail failed:`,
      mailErr
    )
  }

  return orderData
}
