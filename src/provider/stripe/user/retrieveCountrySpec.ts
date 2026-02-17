import { getStripeClient } from '../client'

export const retrieveCountrySpec = async (countryCode: string) => {
  const stripe = getStripeClient()
  return stripe.countrySpecs.retrieve(countryCode)
}
