import { getStripeClient } from '../client'

export async function listPaymentLinkLineItems(paymentLinkId: string, limit = 1) {
  const stripe = getStripeClient()
  return stripe.paymentLinks.listLineItems(paymentLinkId, { limit })
}
