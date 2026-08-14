import React from 'react'
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

  return (
    <Fieldset
      legend="Country"
      completed={completed}
      children={
        <div style={{ display: 'flex', alignItems: 'center', padding: 20 }}>
          <CountryFlagImage image={match?.image} alt={match?.country || country} width={48} />
          <Typography component="span" style={{ marginLeft: 10 }}>
            {match?.country || 'Country not found'}
          </Typography>
          <input type="hidden" name="account_country" value={normalizedCountry || ''} />
        </div>
      }
    />
  )
}
export default CountryField
