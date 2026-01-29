import models from '../../models'
import requestPromise from 'request-promise'
import TransferMail from '../mail/transfer'

const currentModels = models as any

type OrderPaymentParams = {
  id: number
}

export async function orderPayment(orderParameters: OrderPaymentParams) {
  const order = await currentModels.Order.findByPk(orderParameters.id)
  
  if (order.provider === 'paypal') {
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
    
    const payment = await requestPromise({
      method: 'POST',
      uri: `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${order.authorization_id}/capture`,
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en_US',
        Prefer: 'return=representation',
        Authorization: 'Bearer ' + JSON.parse(response)['access_token'],
        'Content-Type': 'application/json'
      }
    })
    
    const paymentData = JSON.parse(payment)
    const updatedOrder = await order.update(
      {
        transfer_id: paymentData.id
      },
      {
        where: {
          id: order.id
        },
        include: [currentModels.Task, currentModels.User],
        returning: true,
        plain: true
      }
    )
    
    if (!updatedOrder) {
      throw new Error('update_order_error')
    }
    
    const orderData = updatedOrder.dataValues || updatedOrder[0].dataValues
    const [user, task] = await Promise.all([
      currentModels.User.findByPk(orderData.userId),
      currentModels.Task.findByPk(orderData.TaskId)
    ])
    
    const assign = await currentModels.Assign.findByPk(task.dataValues.assigned, {
      include: [currentModels.User]
    })
    TransferMail.notifyOwner(user.dataValues, task.dataValues, orderData.amount)
    TransferMail.success(assign.dataValues.User, task.dataValues, orderData.amount)
    return orderData
  }
  throw new Error('payment-fail-error')
}
