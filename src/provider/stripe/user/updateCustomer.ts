import { Stripe } from 'stripe'

import { getStripeClient } from '../client'

export const updateCustomer = async (customerId: string, params: Stripe.CustomerUpdateParams) => {
  const stripe = getStripeClient()
  return stripe.customers.update(customerId, params)
}
