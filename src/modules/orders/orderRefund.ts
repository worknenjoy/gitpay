import models from '../../models'
import PaymentMail from '../../mail/payment'
import { calculateAmountWithPercent } from '../../utils'
import stripeModule from '../../client/payment/stripe'
import { PaypalConnect } from '../../client/provider/paypal'
const stripe = stripeModule()

const currentModels = models as any

type OrderRefundParams = {
  id: number
  userId: number
}

export async function orderRefund(orderParams: OrderRefundParams) {
  const order = await currentModels.Order.findOne({
    where: { id: orderParams.id, userId: orderParams.userId },
    include: currentModels.User
  })

  switch (order.provider) {
    case 'stripe': {
      const refundAmountExcludingFees = calculateAmountWithPercent(
        order.amount,
        8,
        'decimal'
      ).centavos
      const refund = await stripe.refunds.create({
        charge: order.source,
        amount: refundAmountExcludingFees
      })
      if (refund && refund.id) {
        const orderUpdate = await currentModels.Order.update(
          {
            status: 'refunded',
            refund_id: refund.id
          },
          {
            where: { id: order.id },
            returning: true,
            plain: true
          }
        )

        const orderData =
          orderUpdate && orderUpdate[1] ? orderUpdate[1].dataValues : orderUpdate.dataValues
        const [user, task] = await Promise.all([
          currentModels.User.findByPk(orderData.userId),
          currentModels.Task.findByPk(orderData.TaskId)
        ])

        if (orderData.amount) {
          PaymentMail.refund(user, task, orderData)
        } else {
          PaymentMail.error(user.dataValues, task, orderData.amount)
        }

        return orderData
      }
      break
    }

    case 'paypal': {
      const paymentData = await PaypalConnect({
        method: 'POST',
        uri: `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${order.authorization_id}/void`
      })

      const updatedOrder = await order.update(
        {
          status: 'refunded',
          refund_id: paymentData.id
        },
        {
          where: { id: order.id },
          include: [currentModels.Task, currentModels.User],
          returning: true,
          plain: true
        }
      )

      if (!updatedOrder) {
        throw new Error('update_order_error')
      }

      const orderData = updatedOrder.dataValues || (updatedOrder[0] && updatedOrder[0].dataValues)

      const [user, task] = await Promise.all([
        currentModels.User.findByPk(orderData.userId),
        currentModels.Task.findByPk(orderData.TaskId)
      ])

      PaymentMail.refund(user, task.dataValues, orderData)
      return orderData
    }

    default:
      break
  }
}
