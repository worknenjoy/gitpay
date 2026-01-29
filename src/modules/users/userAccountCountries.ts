const stripe = require('../shared/stripe/stripe')()
const getUserAccount = require('./userAccount')

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
