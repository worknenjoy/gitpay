import React from 'react'
import CountryField from '../../../atoms/inputs/fields/country-field/country-field'
import CurrencyField from '../../../atoms/inputs/fields/currency-field/currency-field'
import { Grid } from '@mui/material'

type CountryCurrencyFormProps = {
  country?: string
  countries?: any
  currency?: string
  completed?: boolean
  excludeCurrency?: boolean
}

const CountryCurrencyForm = ({
  country,
  countries,
  currency,
  completed,
  excludeCurrency = false
}: CountryCurrencyFormProps) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: excludeCurrency ? 12 : 6 }}>
        <CountryField country={country} completed={completed} />
      </Grid>
      {!excludeCurrency && (
        <Grid size={{ xs: 12, md: 6 }}>
          <CurrencyField
            countries={countries}
            disabled={true}
            onChange={() => {}}
            completed={completed}
            currency={currency}
          />
        </Grid>
      )}
    </Grid>
  )
}
export default CountryCurrencyForm
