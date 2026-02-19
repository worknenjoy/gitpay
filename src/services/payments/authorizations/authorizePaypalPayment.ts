import { PaypalConnect } from '../../../client/provider/paypal'

function validateAuthorizationId(authorizationId: string): string {
  const AUTH_ID_REGEX = /^[A-Za-z0-9\-_.]{1,128}$/
  if (!AUTH_ID_REGEX.test(authorizationId)) {
    throw new Error('Invalid authorization id')
  }
  return authorizationId
}

type AuthorizePaypalPaymentParams = {
  authorizationId: string
}

// Note: despite the name, this captures (charges) an existing authorization.
export async function authorizePaypalPayment({ authorizationId }: AuthorizePaypalPaymentParams) {
  const safeAuthorizationId = validateAuthorizationId(authorizationId)

  return PaypalConnect({
    method: 'POST',
    uri: `${process.env.PAYPAL_HOST}/v2/payments/authorizations/${safeAuthorizationId}/capture`
  })
}
