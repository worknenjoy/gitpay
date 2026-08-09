import { getDefaultPaymentProviderName } from '../../providers'
import { getSupportedCountriesForProvider } from '../../providers/shared/supportedCountries'
import { findUserByIdSimple } from '../../queries/user/findUserByIdSimple'
import { currencyForCountry } from '../../utils/currency/currency-map'

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
 * - For Whop: `default_currency` is derived from the user's country (no Stripe Country Spec).
 */
export async function userAccountCountries(userParameters: UserAccountCountriesParams) {
  const provider = getDefaultPaymentProviderName()
  const countries = getSupportedCountriesForProvider(provider)

  if (provider === 'whop') {
    const user = await findUserByIdSimple(userParameters.id)
    const country = user?.dataValues?.country || null
    const default_currency = currencyForCountry(country)
    return {
      provider: 'whop',
      countries,
      default_currency,
      supported_bank_account_currencies: {
        [default_currency]: default_currency
      },
      // Helpful for Account Holder form when account payload is still loading
      country
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
