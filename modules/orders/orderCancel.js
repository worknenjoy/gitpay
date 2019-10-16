const Promise = require('bluebird')
const models = require('../../models')
const requestPromise = require('request-promise')
const PaymentMail = require('../mail/payment')

module.exports = Promise.method(function orderCancel (orderParameters) {
  return models.Order
    .findOne({
      where: {
        id: orderParameters.id
      },
      include: [models.User, models.Task]
    })
    .then(order => {
      if (order.dataValues.userId !== orderParameters.userId) throw new Error('User not authorized')
      if (order.dataValues.provider === 'paypal') {
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
          // eslint-disable-next-line no-console
          console.log('response from oauth token', response)
          const cancelUri = `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${order.dataValues.authorization_id}/void`
          return requestPromise({
            method: 'POST',
            uri: cancelUri,
            headers: {
              'Accept': '*/*',
              'Accept-Language': 'en_US',
              'Authorization': 'Bearer ' + JSON.parse(response)['access_token'],
              'Content-Type': 'application/json'
            }
          }).then(payment => {
            // eslint-disable-next-line no-console
            console.log('payment response for cancel', payment)
            return order.updateAttributes({
              status: 'canceled',
              paid: 'false'
            }).then(orderUpdated => {
              // eslint-disable-next-line no-console
              console.log('orderUpdated', orderUpdated)
              if (orderUpdated) {
                PaymentMail.cancel(order.dataValues.User, order.dataValues.Task, order)
              }
              return orderUpdated
            })
          })
        })
      }
      return order
    })
})
