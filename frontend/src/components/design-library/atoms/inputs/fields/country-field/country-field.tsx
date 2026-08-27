import React from 'react'
import { FormattedMessage } from 'react-intl'
import Fieldset from '../../fieldset/fieldset'
import { Typography } from '@mui/material'
import { getSupportedCountryCodes } from '../../../../../areas/private/shared/provider-country-codes'
import CountryFlagImage from '../../../../../areas/private/shared/country-flag-image'
import { normalizeCountryCode } from '../../../../../areas/private/shared/iso3166-alpha3'

const CountryField = ({ country, completed }) => {
  const countryCodes = getSupportedCountryCodes()
  // Accepts either 2-letter or 3-letter ISO country codes (some sources, e.g. Whop's
  // identity profile address fields, return the 3-letter form).
  const normalizedCountry = normalizeCountryCode(country) || country
  const match = countryCodes.find((c) => c.code === normalizedCountry)
  // Distinguish "not known yet" (no country given at all, e.g. pending KYC) from
  // "given but unrecognized" (a country value was supplied but didn't match).
  const label = country ? (
    match?.country || (
      <FormattedMessage
        id="design-library.country-field.notFound"
        defaultMessage="Country not found"
      />
    )
  ) : (
    <FormattedMessage
      id="design-library.country-field.pending"
      defaultMessage="Pending verification"
    />
  )

  return (
    <Fieldset
      legend="Country"
      completed={completed}
      children={
        <div style={{ display: 'flex', alignItems: 'center', padding: 20 }}>
          <CountryFlagImage image={match?.image} alt={match?.country || country} width={48} />
          <Typography component="span" style={{ marginLeft: 10 }}>
            {label}
          </Typography>
          <input type="hidden" name="account_country" value={normalizedCountry || ''} />
        </div>
      }
    />
  )
}
export default CountryField
