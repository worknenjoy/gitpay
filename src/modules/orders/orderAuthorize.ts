import models from '../../models'
import PaymentMail from '../mail/payment'
import requestPromise from 'request-promise'
import { comment } from '../bot/comment'
import * as slack from '../shared/slack'

const currentModels = models as any

type OrderAuthorizeParams = {
  token: string
  PayerID: string
}

export async function orderAuthorize(orderParameters: OrderAuthorizeParams) {
  const response = await requestPromise({
    method: 'POST',
    uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      Authorization:
        'Basic ' +
        Buffer.from(process.env.PAYPAL_CLIENT + ':' + process.env.PAYPAL_SECRET).toString('base64'),
      'Content-Type': 'application/json',
      grant_type: 'client_credentials'
    },
    form: {
      grant_type: 'client_credentials'
    }
  })
  
  const authorize = await requestPromise({
    method: 'POST',
    uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders/${orderParameters.token}/authorize`,
    headers: {
      Accept: '*/*',
      Prefer: 'return=representation',
      'Accept-Language': 'en_US',
      Authorization: 'Bearer ' + JSON.parse(response)['access_token'],
      'Content-Type': 'application/json'
    }
  })
  
  const authorization = JSON.parse(authorize)
  const order = await currentModels.Order.update(
    {
      payer_id: orderParameters.PayerID,
      paid: !!(orderParameters.token && orderParameters.PayerID && authorization.id),
      status:
        orderParameters.token && orderParameters.PayerID && authorization.id
          ? 'succeeded'
          : 'fail',
      authorization_id:
        authorization.purchase_units &&
        authorization.purchase_units[0] &&
        authorization.purchase_units[0].payments &&
        authorization.purchase_units[0].payments.authorizations[0].id
    },
    {
      where: {
        token: orderParameters.token
      },
      returning: true,
      plain: true
    }
  )
  
  const orderData = order[1].dataValues
  const [user, task] = await Promise.all([
    currentModels.User.findByPk(orderData.userId),
    currentModels.Task.findByPk(orderData.TaskId)
  ])
  
  if (orderData.paid) {
    comment(orderData, task)
    PaymentMail.success(user, task, orderData.amount)

    // Send Slack notification for PayPal payment completion
    const orderDataForNotification = {
      amount: orderData.amount,
      currency: orderData.currency || 'USD'
    }
    await slack.notifyBounty(task, orderDataForNotification, user, 'PayPal payment')
  } else {
    PaymentMail.error(user.dataValues, task, orderData.amount)
  }
  
  if (task.dataValues.assigned) {
    const assignedId = task.dataValues.assigned
    const assign = await currentModels.Assign.findByPk(assignedId, {
      include: [currentModels.User]
    })
    PaymentMail.assigned(assign.dataValues.User.dataValues, task, orderData.amount)
    return orderData
  }
  return orderData
}
