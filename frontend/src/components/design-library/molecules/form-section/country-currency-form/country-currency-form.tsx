import React from 'react';
import CountryField from '../../../atoms/inputs/fields/country-field/country-field';
import CurrencyField from '../../../atoms/inputs/fields/currency-field/currency-field';
import { Grid } from '@material-ui/core';

const CountryCurrencyForm = ({ country, countries, currency, completed}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <CountryField
          country={country}
          completed={completed}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CurrencyField
          countries={countries}
          disabled={true}
          onChange={() => {}}
          completed={completed}
          currency={currency}
        />
      </Grid>
    </Grid>
  );
}
export default CountryCurrencyForm;