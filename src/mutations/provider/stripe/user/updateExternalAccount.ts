import { Stripe } from 'stripe'

import { getStripeClient } from '../../../../provider/stripe/client'

export const updateExternalAccount = async (
  accountId: string,
  externalAccountId: string,
  params: Stripe.AccountUpdateExternalAccountParams
) => {
  const stripe = getStripeClient()
  return stripe.accounts.updateExternalAccount(accountId, externalAccountId, params)
}
