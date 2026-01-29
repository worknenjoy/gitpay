import models from '../../models'
const requestPromise = require('request-promise')
const URLSearchParams = require('url-search-params')
const URL = require('url')

const stripe = require('../shared/stripe/stripe')()

const currentModels = models as any

type OrderUpdateParams = {
  id: number
}

export async function orderUpdate(orderParameters: OrderUpdateParams) {
  const order = await currentModels.Order.findOne({
    where: {
      id: orderParameters.id
    }
  })
  const { id, provider, amount, plan, currency } = order.dataValues
  if (provider === 'paypal' && id) {
    const totalPrice = currentModels.Plan.calcFinalPrice(amount, plan)
    try {
      const response = await requestPromise({
        method: 'POST',
        uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en_US',
          Authorization:
            'Basic ' +
            Buffer.from(process.env.PAYPAL_CLIENT + ':' + process.env.PAYPAL_SECRET).toString(
              'base64'
            ),
          'Content-Type': 'application/json',
          grant_type: 'client_credentials'
        },
        form: {
          grant_type: 'client_credentials'
        }
      })
      
      const payment = await requestPromise({
        method: 'POST',
        uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders`,
        headers: {
          Accept: '*/*',
          Prefer: 'return=representation',
          'Accept-Language': 'en_US',
          Authorization: 'Bearer ' + JSON.parse(response)['access_token'],
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          intent: 'AUTHORIZE',
          purchase_units: [
            {
              amount: {
                value: totalPrice,
                currency_code: currency
              },
              description: 'Development services provided by Gitpay'
            }
          ],
          application_context: {
            return_url: `${process.env.API_HOST}/orders/authorize`,
            cancel_url: `${process.env.API_HOST}/orders/authorize`
          },
          payer: {
            payment_method: 'paypal'
          }
        })
      })
      
      console.log('response from paypal payment', response)
      // eslint-disable-next-line no-console
      const paymentData = JSON.parse(payment)
      const paymentUrl = paymentData.links[1].href
      const resultUrl = URL.parse(paymentUrl)
      const searchParams = new URLSearchParams(resultUrl.search)
      const orderUpdated = await order.update(
        {
          source_id: paymentData.id,
          authorization_id:
            paymentData.purchase_units &&
            paymentData.purchase_units[0] &&
            paymentData.purchase_units[0].payments &&
            paymentData.purchase_units[0].payments.authorizations[0].id,
          payment_url: paymentUrl,
          token: searchParams.get('token')
        },
        {
          where: {
            id
          }
        }
      )
      return orderUpdated
    } catch (error) {
      throw error
    }
  }
}
