const Promise = require('bluebird')
const models = require('../../loading/loading')
const requestPromise = require('request-promise')
const URLSearchParams = require('url-search-params')
const URL = require('url')

/*

 curl -v https://api.sandbox.paypal.com/v1/payments/payment/PAY-86D79543R5702204MLM7FQ3I/execute/ \
 -H "Content-Type:application/json" \
 -H "Authorization: Bearer token" \
 -d '{ "payer_id" : "H34ALHYEMUGZQ" }'

 */

module.exports = Promise.method(function orderPayment (orderParameters) {

  return models.Order
    .findById(orderParameters.id)
      .then((order) => {
        if(order.provider === 'paypal') {
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
            console.log('response from oauth token', response)
            return requestPromise({
              method: 'POST',
              uri: `${process.env.PAYPAL_HOST}/v1/payments/payment/${order.source_id}/execute/`,
              headers: {
                'Accept': '*/*',
                'Accept-Language': 'en_US',
                'Authorization': 'Bearer ' + JSON.parse(response)["access_token"],
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "payer_id": order.payer_id
              })
            }).then(payment => {
              console.log('payment execute result', payment)
              return payment
            })
          })
        }
        throw new Error('payment-fail-error')
    })
})
