const Promise = require('bluebird')
const models = require('../../models')
const requestPromise = require('request-promise')
const URLSearchParams = require('url-search-params')
const URL = require('url')

const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)

module.exports = Promise.method(function orderBuilds (orderParameters) {
  return models.Order
    .build(
      {
        source_id: orderParameters.source_id || 'internal_' + Math.random(),
        source_type: orderParameters.source_type,
        currency: orderParameters.currency,
        provider: orderParameters.provider,
        amount: orderParameters.amount,
        email: orderParameters.email,
        userId: orderParameters.userId,
        TaskId: orderParameters.taskId,
        plan: {
          plan: orderParameters.plan
        },
        include: [
          models.User,
          {
            association: models.Order.Plan,
            include: [ models.Plan.plan ]
          }
        ]
      }
    )
    .save()
    .then(order => {
      if (orderParameters.customer_id && orderParameters.provider === 'stripe' && orderParameters.source_type === 'invoice-item') {
        stripe.invoiceItems.create({
          customer: orderParameters.customer_id,
          currency: 'usd',
          // price: 'price_1IkrS62eZvKYlo2CHsI3LJLi',
          quantity: 1,
          description: 'Development service for a task on Gitpay: ' + 'https://gitpay.me/#/task/' + orderParameters.taskId,
          unit_amount: orderParameters.amount * 100 * 1.18,
          metadata: {
            'task_id': orderParameters.taskId,
            'order_id': order.dataValues.id
          }
        }).then(invoiceItem => {
          stripe.invoices.create({
            customer: orderParameters.customer_id,
            metadata: {
              'task_id': orderParameters.taskId,
              'order_id': order.dataValues.id
            }
          }).then(invoice => {
            return order.update(
              {
                source_id: invoice.id
              },
              {
                where: {
                  id: order.dataValues.id
                }
              }).then(orderUpdated => {
              return orderUpdated
            })
          })
        })
      }
      if (orderParameters.provider === 'paypal') {
        const totalPrice = models.Plan.calcFinalPrice(orderParameters.amount, orderParameters.plan)
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
            uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders`,
            headers: {
              'Accept': '*/*',
              'Prefer': 'return=representation',
              'Accept-Language': 'en_US',
              'Authorization': 'Bearer ' + JSON.parse(response)['access_token'],
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'intent': 'AUTHORIZE',
              'purchase_units': [{
                'amount': {
                  'value': totalPrice,
                  'currency_code': orderParameters.currency
                },
                'description': 'Development services provided by Gitpay',
              }],
              'application_context': {
                'return_url': `${process.env.API_HOST}/orders/update`,
                'cancel_url': `${process.env.API_HOST}/orders/update`
              },
              'payer': {
                'payment_method': 'paypal'
              }
            })
          }).then(payment => {
            // eslint-disable-next-line no-console
            console.log('payment result', payment)
            const paymentData = JSON.parse(payment)
            const paymentUrl = paymentData.links[1].href
            const resultUrl = URL.parse(paymentUrl)
            const searchParams = new URLSearchParams(resultUrl.search)
            return order.update({
              source_id: paymentData.id,
              authorization_id: paymentData.purchase_units && paymentData.purchase_units[0] && paymentData.purchase_units[0].payments && paymentData.purchase_units[0].payments.authorizations[0].id,
              payment_url: paymentUrl,
              token: searchParams.get('token')
            }, {
              where: {
                id: order.dataValues.id
              }
            }).then(orderUpdated => {
              return orderUpdated
            })
          })
        })
      }
      return order
    })
})
