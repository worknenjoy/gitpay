const Promise = require('bluebird')
const models = require('../../models')
const requestPromise = require('request-promise')
const TransferMail = require('../mail/transfer')

module.exports = Promise.method(function orderPayment (orderParameters) {
  return models.Order
    .findById(orderParameters.id)
    .then((order) => {
      if (order.provider === 'paypal') {
        return requestPromise({
          method: 'POST',
          uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
          headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en_US',
            'Authorization': 'Basic ' + Buffer.from(process.env.PAYPAL_CLIENT + ':' + process.env.PAYPAL_SECRET).toString('base64'),
            'Content-Type': 'application/json',
            'grant_type': 'client_credentials'
          },
          form: {
            'grant_type': 'client_credentials'
          }
        }).then(response => {
          return requestPromise({
            method: 'POST',
            uri: `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${order.authorization_id}/capture`,
            headers: {
              'Accept': '*/*',
              'Accept-Language': 'en_US',
              'Prefer': 'return=representation',
              'Authorization': 'Bearer ' + JSON.parse(response)['access_token'],
              'Content-Type': 'application/json'
            }
          }).then(payment => {
            const paymentData = JSON.parse(payment)
            // eslint-disable-next-line no-console
            console.log('payment execute result', payment, paymentData)
            return order.updateAttributes({
              transfer_id: paymentData.id
            }, {
              include: [models.Task, models.User],
              returning: true,
              plain: true
            }).then(updatedOrder => {
              // eslint-disable-next-line no-console
              console.log('updatedOrder', updatedOrder)
              if (!updatedOrder) {
                throw new Error('update_order_error')
              }
              const orderData = updatedOrder.dataValues || updatedOrder[0].dataValues
              return Promise.all([models.User.findById(orderData.userId), models.Task.findById(orderData.TaskId)]).spread((user, task) => {
                return models.Assign.findById(task.dataValues.assigned, {
                  include: [models.User]
                }).then(assign => {
                  TransferMail.notifyOwner(user.dataValues, task.dataValues, orderData.amount)
                  TransferMail.success(assign.dataValues.User, task.dataValues, orderData.amount)
                  return orderData
                })
              })
            })
          })
        })
      }
      throw new Error('payment-fail-error')
    })
})
