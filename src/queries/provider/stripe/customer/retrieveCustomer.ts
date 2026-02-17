import { getStripeClient } from '../../../../provider/stripe/client'

export const retrieveCustomer = async (customerId: string) => {
  const stripe = getStripeClient()
  return stripe.customers.retrieve(customerId)
}
