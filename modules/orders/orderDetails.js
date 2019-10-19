const Promise = require('bluebird')
const models = require('../../models')
const requestPromise = require('request-promise')

module.exports = Promise.method(function orderDetails (orderParams) {
  return models.Order
    .findOne(
      { where: { id: orderParams.id }, include: models.User }
    )
    .then(order => {
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
          method: 'GET',
          uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders/${order.dataValues.source_id}`,
          headers: {
            'Accept': '*/*',
            'Prefer': 'return=representation',
            'Accept-Language': 'en_US',
            'Authorization': 'Bearer ' + JSON.parse(response)['access_token'],
            'Content-Type': 'application/json'
          }
        }).then(orderDetails => {
          const orderDetailsParsed = JSON.parse(orderDetails)
          const orderData = order.dataValues
          return {
            ...orderData,
            paypal: {
              status: orderDetailsParsed.status,
              intent: orderDetailsParsed.intent,
              created_at: orderDetailsParsed.create_time
            }
          }
        })
      })
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
