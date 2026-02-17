import { getStripeClient } from '../../../../provider/stripe/client'

export async function updatePaymentRequestPaymentLinkActive(
  paymentLinkId: string,
  active: boolean
) {
  const stripe = getStripeClient()
  return stripe.paymentLinks.update(paymentLinkId, { active })
}
