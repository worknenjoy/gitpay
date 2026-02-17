import { getStripeClient } from '../client'
import type { PaymentRequestStripeResources } from './createPaymentRequestResources'

// Stripe resources generally cannot be hard-deleted safely.
// Best-effort deactivation prevents accidental usage if DB tx rolls back.
export async function deactivatePaymentRequestStripeResources(
  resources: Partial<PaymentRequestStripeResources>
) {
  const stripe = getStripeClient()

  if (resources.paymentLinkId) {
    try {
      await stripe.paymentLinks.update(resources.paymentLinkId, { active: false })
    } catch (error) {
      console.error('Failed to deactivate Stripe payment link', error)
    }
  }

  if (resources.priceId) {
    try {
      await stripe.prices.update(resources.priceId, { active: false })
    } catch (error) {
      console.error('Failed to deactivate Stripe price', error)
    }
  }

  if (resources.productId) {
    try {
      await stripe.products.update(resources.productId, { active: false })
    } catch (error) {
      console.error('Failed to deactivate Stripe product', error)
    }
  }
}
