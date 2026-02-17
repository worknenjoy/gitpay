import { getStripeClient } from '../client'

export const retrieveCustomer = async (customerId: string) => {
  const stripe = getStripeClient()
  return stripe.customers.retrieve(customerId)
}
