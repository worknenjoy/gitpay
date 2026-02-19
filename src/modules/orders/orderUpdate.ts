import models from '../../models'
// @ts-ignore - url-search-params has no type definitions
import URLSearchParams from 'url-search-params'
import * as URL from 'url'
import { PaypalConnect } from '../../client/provider/paypal'

import stripeModule from '../../client/payment/stripe'
const stripe = stripeModule()

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
    const paymentData = await PaypalConnect({
      method: 'POST',
      uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders`,
      body: {
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
      }
    })
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
  }
}
