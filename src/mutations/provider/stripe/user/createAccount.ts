import { Stripe } from 'stripe'

import { getStripeClient } from '../../../../provider/stripe/client'

export const createAccount = async (params: Stripe.AccountCreateParams) => {
  const stripe = getStripeClient()
  return stripe.accounts.create(params)
}
