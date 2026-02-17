import { getStripeClient } from '../client'

export async function retrieveProduct(productId: string) {
  const stripe = getStripeClient()
  return stripe.products.retrieve(productId)
}
