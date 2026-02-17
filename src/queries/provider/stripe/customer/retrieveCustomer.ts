import { retrieveCustomer as providerRetrieveCustomer } from '../../../../provider/stripe/user'

export const retrieveCustomer = async (customerId: string) => {
  return providerRetrieveCustomer(customerId)
}
