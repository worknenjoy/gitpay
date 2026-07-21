import { getDefaultPaymentProviderName } from '../../providers'
import {
  getSupportedCountriesForProvider,
  type SupportedCountry
} from '../../providers/shared/supportedCountries'

type UserAccountCountriesParams = {
  id: number
}

/**
 * Countries available for payout onboarding for the active payment provider.
 *
 * Response shape (backward compatible for Stripe bank forms):
 * - `provider`: active payment connector
 * - `countries`: onboarding country list for that provider
 * - For Stripe with an existing account: also spreads Country Spec fields
 *   (`default_currency`, `supported_bank_account_currencies`, …) at the root
 *   so existing bank currency UI keeps working.
 */
export async function userAccountCountries(userParameters: UserAccountCountriesParams) {
  const provider = getDefaultPaymentProviderName()
  const countries = getSupportedCountriesForProvider(provider)

  if (provider === 'whop') {
    return {
      provider: 'whop',
      countries
    }
  }

  try {
    const { getUserStripeCountrySpecs } = await import(
      '../../queries/user/stripe/getUserStripeCountrySpecs'
    )
    const country_spec = await getUserStripeCountrySpecs(userParameters.id)
    const hasSpec = country_spec && Object.keys(country_spec).length > 0

    return {
      provider: 'stripe',
      countries,
      ...(hasSpec ? country_spec : {})
    }
  } catch (e) {
    return {
      provider: 'stripe',
      countries
    }
  }
}
