import { retrieveCountrySpec as providerRetrieveCountrySpec } from '../../../../provider/stripe/user'

export const retrieveCountrySpec = async (countryCode: string) => {
  return providerRetrieveCountrySpec(countryCode)
}
