import { retrieveCountrySpec } from '../../provider/stripe/country-spec'

import { getUserStripeAccount } from './getUserStripeAccount'

export const getUserStripeCountrySpecs = async (userId: number) => {
  const userAccount: any = await getUserStripeAccount(userId)
  const accountCountry = userAccount?.country

  if (!accountCountry) {
    return {}
  }

  return retrieveCountrySpec(accountCountry)
}
