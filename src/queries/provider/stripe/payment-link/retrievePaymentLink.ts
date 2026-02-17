import { getStripeClient } from '../../../../provider/stripe/client'

export async function retrievePaymentLink(paymentLinkId: string) {
  const stripe = getStripeClient()
  return stripe.paymentLinks.retrieve(paymentLinkId)
}
