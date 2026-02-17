import { getStripeClient } from '../../../../provider/stripe/client'

export const deleteAccount = async (accountId: string) => {
  const stripe = getStripeClient()
  return stripe.accounts.del(accountId)
}
