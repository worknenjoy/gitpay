const Promise = require('bluebird')
const models = require('../../loading/loading')
const requestPromise = require('request-promise')

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
          uri: `https://api.sandbox.paypal.com/v1/oauth2/token`,
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
          console.log('response from token', response)
          return requestPromise({
            method: 'POST',
            uri: `https://api.sandbox.paypal.com/v1/payments/payment`,
            headers: {
              'Accept': '*/*',
              'Accept-Language': 'en_US',
              'Authorization': 'Bearer ' + JSON.parse(response)["access_token"],
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "intent": "sale",
              "redirect_urls": {
                "return_url": "https://localhost:3000/payments",
                "cancel_url": "https://localhost:3000/payments"
              },
              "payer": {
                "payment_method": "paypal"
              },
              "transactions": [{
                "amount": {
                  "total": "7.47",
                  "currency": "USD"
                }
              }]
            })
          }).then(payment => {
            console.log('paypal payment response', payment)
            const paymentData = JSON.parse(payment)
            order.updateAttributes({
              source_id: paymentData.id,
              source: paymentData.links[1].href
            }).then(orderUpdated => {
              console.log(orderUpdated)
              return orderUpdated
            })
          })
        })
      }
      return order
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.log('error to stripe account')
      // eslint-disable-next-line no-console
      console.log(err)
      return err
    })
})
