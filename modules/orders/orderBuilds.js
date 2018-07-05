const Promise = require('bluebird')
const models = require('../../loading/loading')
const requestPromise = require('request-promise')
const URLSearchParams = require('url-search-params')
const URL = require('url')

module.exports = Promise.method(function orderBuilds (orderParameters) {

  return models.Order
    .build(
      orderParameters
    )
    .save()
    .then((order) => {
      if(orderParameters.provider === 'paypal') {
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
            uri: `${process.env.PAYPAL_HOST}/v1/payments/payment`,
            headers: {
              'Accept': '*/*',
              'Accept-Language': 'en_US',
              'Authorization': 'Bearer ' + JSON.parse(response)["access_token"],
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "intent": "sale",
              "redirect_urls": {
                "return_url": `${process.env.API_HOST}/orders/update`,
                "cancel_url": `${process.env.API_HOST}/orders/update`
              },
              "payer": {
                "payment_method": "paypal"
              },
              "transactions": [{
                "amount": {
                  "total": orderParameters.amount,
                  "currency": orderParameters.currency
                }
              }]
            })
          }).then(payment => {
            console.log('payment result', payment)
            const paymentData = JSON.parse(payment)
            const paymentUrl = paymentData.links[1].href
            const resultUrl = URL.parse(paymentUrl)
            const searchParams = new URLSearchParams(resultUrl.search)

            return order.updateAttributes({
              source_id: paymentData.id,
              payment_url: paymentUrl,
              token: searchParams.get('token')
            }).then(orderUpdated => {
              return orderUpdated
            })
          })
        })
      }
      return order
    })
})
