import models from '../../models'
import { refundStripePayment } from '../../services/payments/refunds/refundStripePayment'
import { refundPaypalPayment } from '../../services/payments/refunds/refundPaypalPayment'

const currentModels = models as any

type OrderRefundParams = {
  id: number
  userId: number
}

export async function orderRefund(orderParams: OrderRefundParams) {
  const order = await currentModels.Order.findOne({
    where: { id: orderParams.id, userId: orderParams.userId }
  })

  switch (order.provider) {
    case 'stripe':
      return refundStripePayment({ orderId: order.id })

    case 'paypal':
      return refundPaypalPayment({ orderId: order.id })

    default:
      break
  }
}
