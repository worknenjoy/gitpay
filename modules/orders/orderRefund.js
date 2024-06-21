const Promise = require('bluebird')
const models = require('../../models')
const PaymentMail = require('../mail/payment')
const requestPromise = require('request-promise')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)

module.exports = Promise.method(function orderRefund (orderParams) {
  return models.Order
    .findOne(
      { where: { id: orderParams.id }, include: models.User }
    )
    .then(async order => {
      let refund;
      switch (order.provider) {
        case 'stripe':
          refund = await stripe.refunds.create({
            charge: order.source,
          })
          if (refund.id) {
            return models.Order
              .update({
                status: 'refunded',
                refund_id: refund.id
              }, {
                where: {
                  id: order.id
                },
                returning: true,
                plain: true
              }).then(orderUpdate => {
                const orderData = orderUpdate[1].dataValues
                return Promise.all([models.User.findByPk(orderData.userId), models.Task.findByPk(orderData.TaskId)]).spread((user, task) => {
                  if (orderData.amount) {
                    PaymentMail.refund(user, task, orderData)
                  }
                  else {
                    PaymentMail.error(user.dataValues, task, orderData.amount)
                  }
                  return orderData
                })
              })
          }
          break
        case 'paypal':
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
              uri: `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${order.authorization_id}/void`,
              headers: {
                'Accept': '*/*',
                'Accept-Language': 'en_US',
                'Prefer': 'return=representation',
                'Authorization': 'Bearer ' + JSON.parse(response)['access_token'],
                'Content-Type': 'application/json'
              }
            }).then(payment => {
              const paymentData = JSON.parse(payment)
              return order.update({
                status: 'refunded',
                refund_id: paymentData.id
              }, {
                where: {
                  id: order.id
                },
                include: [models.Task, models.User],
                returning: true,
                plain: true
              }).then(updatedOrder => {
                if (!updatedOrder) {
                  throw new Error('update_order_error')
                }
                const orderData = updatedOrder.dataValues || updatedOrder[0].dataValues
                return Promise.all([models.User.findByPk(orderData.userId), models.Task.findByPk(orderData.TaskId)]).spread((user, task) => {
                  PaymentMail.refund(user, task.dataValues, orderData)
                  return orderData
                })
              })
            })
          })
        default:
          break
      }
    })
})
