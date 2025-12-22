import requestPromise from 'request-promise'

export default async function orderFetchPaypal(sourceId: any) {
  const tokenResponse = await requestPromise({
    method: 'POST',
    uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      Authorization:
        'Basic ' +
        Buffer.from(`${process.env.PAYPAL_CLIENT}:${process.env.PAYPAL_SECRET}`).toString(
          'base64'
        ),
      'Content-Type': 'application/json',
      grant_type: 'client_credentials'
    },
    form: {
      grant_type: 'client_credentials'
    }
  })

  const token = JSON.parse(tokenResponse).access_token

  const orderDetails = await requestPromise({
    method: 'GET',
    uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders/${sourceId}`,
    headers: {
      Accept: '*/*',
      Prefer: 'return=representation',
      'Accept-Language': 'en_US',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  const orderDetailsParsed = JSON.parse(orderDetails)

  return {
    paypal: {
      status: orderDetailsParsed.status,
      intent: orderDetailsParsed.intent,
      created_at: orderDetailsParsed.create_time
    }
  }
}