import models from '../../models'
import requestPromise from 'request-promise'
import PaymentMail from '../mail/payment'

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
      const response = await requestPromise({
        method: 'POST',
        uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en_US',
          Authorization:
            'Basic ' +
            Buffer.from(process.env.PAYPAL_CLIENT + ':' + process.env.PAYPAL_SECRET).toString(
              'base64'
            ),
          'Content-Type': 'application/json',
          grant_type: 'client_credentials'
        },
        form: {
          grant_type: 'client_credentials'
        }
      })

      const cancelUri = `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${order.dataValues.authorization_id}/void`
      const payment = await requestPromise({
        method: 'POST',
        uri: cancelUri,
        headers: {
          Accept: '*/*',
          'Accept-Language': 'en_US',
          Authorization: 'Bearer ' + JSON.parse(response)['access_token'],
          'Content-Type': 'application/json'
        }
      })

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
