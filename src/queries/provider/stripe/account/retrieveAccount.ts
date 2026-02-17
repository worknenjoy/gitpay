import { getStripeClient } from '../../../../provider/stripe/client'

export const retrieveAccount = async (accountId: string) => {
  const stripe = getStripeClient()
  return stripe.accounts.retrieve(accountId)
}
