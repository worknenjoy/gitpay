import { getStripeClient } from '../client'

export async function updatePaymentIntentMetadata(
  paymentIntentId: string,
  metadata: Record<string, string | number | null | undefined>
) {
  const stripe = getStripeClient()
  return stripe.paymentIntents.update(paymentIntentId, { metadata: metadata as any })
}
