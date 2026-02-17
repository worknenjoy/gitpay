import { Stripe } from 'stripe'

import { getStripeClient } from '../client'

export const listExternalAccounts = async (
  accountId: string,
  params: Stripe.AccountListExternalAccountsParams
) => {
  const stripe = getStripeClient()
  return stripe.accounts.listExternalAccounts(accountId, params)
}
