import { getStripeClient } from '../../../../provider/stripe/client'

export async function retrieveProduct(productId: string, stripeAccount?: string) {
  const stripe = getStripeClient()
  return stripe.products.retrieve(productId, {}, { stripeAccount })
}
