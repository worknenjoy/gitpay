import stripeModule from '../shared/stripe/stripe'
const stripe = stripeModule()
import { userAccount as getUserAccount } from './userAccount'

type UserAccountCountriesParams = {
  id: number
}

export async function userAccountCountries(userParameters: UserAccountCountriesParams) {
  const { id } = userParameters
  const userAccount = await getUserAccount({ id })
  const accountCountry = userAccount.country
  if (!accountCountry) {
    return {}
  }
  const countrySpecs = await stripe.countrySpecs.retrieve(accountCountry)
  return countrySpecs
}
