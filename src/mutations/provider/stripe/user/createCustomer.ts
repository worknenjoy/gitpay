import { Stripe } from 'stripe'

import { getStripeClient } from '../../../../provider/stripe/client'

export const createCustomer = async (params: Stripe.CustomerCreateParams) => {
  const stripe = getStripeClient()
  return stripe.customers.create(params)
}
