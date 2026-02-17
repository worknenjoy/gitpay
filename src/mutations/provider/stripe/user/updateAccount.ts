import { Stripe } from 'stripe'

import { getStripeClient } from '../../../../provider/stripe/client'

export const updateAccount = async (accountId: string, params: Stripe.AccountUpdateParams) => {
  const stripe = getStripeClient()
  return stripe.accounts.update(accountId, params)
}
