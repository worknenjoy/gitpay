import { retrievePaymentLink as retrievePaymentLinkProvider } from '../../../../provider/stripe/payment-request'

export async function retrievePaymentLink(paymentLinkId: string) {
  return retrievePaymentLinkProvider(paymentLinkId)
}
