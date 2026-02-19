import { PaypalConnect } from '../../../client/provider/paypal'

export default async function orderFetchPaypal(sourceId: any) {
  const orderDetailsParsed = await PaypalConnect({
    method: 'GET',
    uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders/${sourceId}`
  })

  return {
    paypal: {
      status: orderDetailsParsed.status,
      intent: orderDetailsParsed.intent,
      created_at: orderDetailsParsed.create_time
    }
  }
}
