import { Stripe } from 'stripe'

import { getStripeClient } from '../client'

export const createCustomer = async (params: Stripe.CustomerCreateParams) => {
  const stripe = getStripeClient()
  return stripe.customers.create(params)
}
