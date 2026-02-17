import { getStripeClient } from '../../../../provider/stripe/client'

export const retrieveBalance = async (accountId?: string) => {
  const stripe = getStripeClient()

  if (accountId) {
    return stripe.balance.retrieve({}, { stripeAccount: accountId })
  }

  return stripe.balance.retrieve()
}
