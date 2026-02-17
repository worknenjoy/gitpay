import { getStripeClient } from '../client'

export const retrieveAccount = async (accountId: string) => {
  const stripe = getStripeClient()
  return stripe.accounts.retrieve(accountId)
}
