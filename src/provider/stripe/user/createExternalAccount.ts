import { Stripe } from 'stripe'

import { getStripeClient } from '../client'

export const createExternalAccount = async (
  accountId: string,
  params: Stripe.AccountCreateExternalAccountParams
) => {
  const stripe = getStripeClient()
  return stripe.accounts.createExternalAccount(accountId, params)
}
