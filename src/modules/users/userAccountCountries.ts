type UserAccountCountriesParams = {
  id: number
}

export async function userAccountCountries(userParameters: UserAccountCountriesParams) {
  const { getUserStripeCountrySpecs } = await import('../../queries/user/stripe/getUserStripeCountrySpecs')
  return getUserStripeCountrySpecs(userParameters.id)
}
