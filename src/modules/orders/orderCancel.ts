import models from '../../models'
import PaymentMail from '../../mail/payment'
import { PaypalConnect } from '../../client/provider/paypal'

const currentModels = models as any

type OrderCancelParams = {
  id: number
}

export async function orderCancel(orderParameters: OrderCancelParams) {
  const order = await currentModels.Order.findOne({
    where: {
      id: orderParameters.id
    },
    include: [currentModels.User, currentModels.Task]
  })

  if (order && order.dataValues && order.dataValues.provider === 'paypal') {
    try {
      const cancelUri = `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${order.dataValues.authorization_id}/void`
      await PaypalConnect({ method: 'POST', uri: cancelUri })

      const orderUpdated = await order.update(
        {
          status: 'canceled',
          paid: 'false'
        },
        {
          where: {
            id: order.dataValues.id
          }
        }
      )

      if (orderUpdated) {
        PaymentMail.cancel(order.dataValues.User, order.dataValues.Task, order)
      }
      return orderUpdated
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('couldnt find payment source cancel anyway, reason:', e)
      const orderUpdated = await order.update(
        {
          status: 'canceled',
          paid: 'false'
        },
        {
          where: {
            id: order.dataValues.id
          }
        }
      )

      if (orderUpdated) {
        PaymentMail.cancel(order.dataValues.User, order.dataValues.Task, order)
      }
      return orderUpdated
    }
  }
  return order
}
