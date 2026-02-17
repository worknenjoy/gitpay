import { getStripeClient } from '../client'

export const deleteCustomer = async (customerId: string) => {
  const stripe = getStripeClient()
  return stripe.customers.del(customerId)
}
