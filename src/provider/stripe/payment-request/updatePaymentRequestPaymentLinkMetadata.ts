import { getStripeClient } from '../client'
import type { StripePaymentRequestMetadata } from './createPaymentRequestResources'

export async function updatePaymentRequestPaymentLinkMetadata(
  paymentLinkId: string,
  metadata: StripePaymentRequestMetadata
) {
  const stripe = getStripeClient()

  return stripe.paymentLinks.update(paymentLinkId, {
    metadata: {
      payment_request_id: metadata.payment_request_id ?? null,
      user_id: metadata.user_id ?? null
    }
  })
}
