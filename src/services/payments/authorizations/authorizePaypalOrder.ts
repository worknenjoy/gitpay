import { PaypalConnect } from '../../../client/provider/paypal'

function validateOrderId(orderId: string): string {
  const ORDER_ID_REGEX = /^[A-Za-z0-9\-_.]{1,64}$/
  if (!ORDER_ID_REGEX.test(orderId)) {
    throw new Error('Invalid order id')
  }
  return orderId
}

type AuthorizePaypalOrderParams = {
  orderId: string
}

export type PaypalOrderAuthorizeResult = {
  id?: string
  status?: string
  purchase_units?: Array<{
    payments?: {
      authorizations?: Array<{ id?: string; status?: string }>
    }
  }>
}

export async function authorizePaypalOrder({ orderId }: AuthorizePaypalOrderParams) {
  const safeOrderId = validateOrderId(orderId)

  const result = (await PaypalConnect({
    method: 'POST',
    uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders/${safeOrderId}/authorize`
  })) as PaypalOrderAuthorizeResult

  const authorizationId =
    result?.purchase_units?.[0]?.payments?.authorizations?.[0]?.id ?? null

  return { result, authorizationId }
}
