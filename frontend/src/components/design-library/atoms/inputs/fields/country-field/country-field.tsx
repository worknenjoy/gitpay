import React from 'react'
import Fieldset from '../../fieldset/fieldset'
import { Typography } from '@mui/material'
import { countryCodes } from '../../../../../areas/private/shared/country-codes'

const CountryField = ({ country, completed }) => {
  return (
    <Fieldset
      legend="Country"
      completed={completed}
      children={
        <div style={{ display: 'flex', alignItems: 'center', padding: 20 }}>
          <img
            width="48"
            src={
              require(
                `images/countries/${countryCodes.find((c) => c.code === country)?.image || 'default'}.png`,
              ).default ||
              require(
                `images/countries/${countryCodes.find((c) => c.code === country)?.image || 'default'}.png`,
              )
            }
          />
          <Typography component="span" style={{ marginLeft: 10 }}>
            {countryCodes.find((c) => c.code === country)?.country || 'Country not found'}
          </Typography>
          <input type="hidden" name="account_country" value={country} />
        </div>
      }
    />
  )
}
export default CountryField
