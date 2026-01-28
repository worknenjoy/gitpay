const PaymentMail = require('../mail/payment')
const Promise = require('bluebird')
const requestPromise = require('request-promise')
const models = require('../../models')
const comment = require('../bot/comment')
const slack = require('../shared/slack')

module.exports = Promise.method(function orderAuthorize(orderParameters) {
  return requestPromise({
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
  }).then((response) => {
    return requestPromise({
      method: 'POST',
      uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders/${orderParameters.token}/authorize`,
      headers: {
        Accept: '*/*',
        Prefer: 'return=representation',
        'Accept-Language': 'en_US',
        Authorization: 'Bearer ' + JSON.parse(response)['access_token'],
        'Content-Type': 'application/json'
      }
    }).then((authorize) => {
      const authorization = JSON.parse(authorize)
      return models.Order.update(
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
      ).then((order) => {
        const orderData = order[1].dataValues
        return Promise.all([
          models.User.findByPk(orderData.userId),
          models.Task.findByPk(orderData.TaskId)
        ]).then(async ([user, task]) => {
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
            return models.Assign.findByPk(assignedId, {
              include: [models.User]
            }).then((assign) => {
              PaymentMail.assigned(assign.dataValues.User.dataValues, task, orderData.amount)
              return orderData
            })
          }
          return orderData
        })
      })
    })
  })
})
