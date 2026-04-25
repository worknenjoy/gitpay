import { getStripeClient } from '../../../../provider/stripe/client'

export async function retrievePaymentIntent(paymentIntentId: string) {
  const stripe = getStripeClient()
  return stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ['latest_charge']
  })
}
