import React from 'react';
import Fieldset from '../../fieldset/fieldset';
import { Typography } from '@material-ui/core';
import { countryCodes } from '../../../../../areas/private/shared/country-codes';
import { account } from 'src/reducers/accountReducer';

const CountryField = ({ country, completed }) => {
  return (
    <Fieldset
      legend='Country'
      completed={completed}
      children={
        <div style={{ display: 'flex', alignItems: 'center', padding: 20 }}>
          <img width='48' src={require(`images/countries/${countryCodes.find(c => c.code === country).image}.png`).default || require(`images/countries/${countryCodes.find(c => c.code === country).image}.png`)} />
          <Typography component='span' style={{ marginLeft: 10 }}>
            {countryCodes.find(c => c.code === country).country}
          </Typography>
        </div>
      }
    />
  );
}
export default CountryField;