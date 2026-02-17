import { getStripeClient } from '../../../../provider/stripe/client'

export async function updatePaymentRequestProductDetails(
  productId: string,
  params: { name?: string; description?: string | null }
) {
  const stripe = getStripeClient()
  return stripe.products.update(productId, {
    name: params.name,
    description: params.description ?? undefined
  })
}
