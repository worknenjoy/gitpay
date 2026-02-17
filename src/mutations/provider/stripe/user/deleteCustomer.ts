import { getStripeClient } from '../../../../provider/stripe/client'

export const deleteCustomer = async (customerId: string) => {
  const stripe = getStripeClient()
  return stripe.customers.del(customerId)
}
