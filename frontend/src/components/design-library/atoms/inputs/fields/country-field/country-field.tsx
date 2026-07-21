import React from 'react'
import Fieldset from '../../fieldset/fieldset'
import { Typography } from '@mui/material'
import { getSupportedCountryCodes } from '../../../../../areas/private/shared/provider-country-codes'
import CountryFlagImage from '../../../../../areas/private/shared/country-flag-image'

const CountryField = ({ country, completed }) => {
  const countryCodes = getSupportedCountryCodes()
  const match = countryCodes.find((c) => c.code === country)

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
          <input type="hidden" name="account_country" value={country} />
        </div>
      }
    />
  )
}
export default CountryField
