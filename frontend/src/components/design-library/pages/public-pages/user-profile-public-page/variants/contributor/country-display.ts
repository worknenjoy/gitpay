import { getSupportedCountryCodes } from '../../../../../../areas/private/shared/provider-country-codes'

// `User.country` is a plain ISO-3166-1 alpha-2 code, only ever populated as a
// side effect of payout-account (KYC) onboarding — so every user who has a
// country set will already be in the same supported-country list used for
// that onboarding flow. Reuse it instead of maintaining a second lookup.
// There's no real timezone data source behind `utcOffset` — we simply don't
// have it, so it's always omitted here.
export const countryDisplay = (country?: string) => {
  if (!country) return undefined
  const match = getSupportedCountryCodes().find(
    (option) => option.code.toUpperCase() === country.toUpperCase()
  )
  if (!match) return { name: country }
  return { image: match.image, name: match.country }
}
