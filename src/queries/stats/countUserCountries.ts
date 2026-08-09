import { getDefaultPaymentProviderName } from '../../providers'
import { getSupportedCountriesForProvider } from '../../providers/shared/supportedCountries'

/**
 * Count of countries available for payout onboarding for the active provider.
 * Stripe and Whop lists differ; this feeds public stats / marketing counts.
 */
export const countUserCountries = async (): Promise<number> => {
  const provider = getDefaultPaymentProviderName()
  return getSupportedCountriesForProvider(provider).length
}
