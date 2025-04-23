import React from 'react';
import { FormControl, Select } from '@material-ui/core';
import { countryCurrencies } from '../../../../../../components/areas/private/shared/country-codes';
import Fieldset from '../../fieldset/fieldset';

const CurrencyField = ({ countries, disabled, onChange }) => {
  const { data: { default_currency, supported_bank_account_currencies }, completed } = countries;

  return (
    <Fieldset
      legend='Currency'
      completed={completed}
    >
      <FormControl style={{ width: '100%' }}>
        <Select
          native
          value={default_currency}
          disabled={disabled}
          onChange={onChange}
          inputProps={{
            name: 'country',
            id: 'country-native-simple',
          }}
        >
          <option aria-label="None" value="" />
          <option value={countries.data.default_currency}>
            {`${countryCurrencies.find(c => c.code.toLowerCase() === default_currency)?.currency} - ${countryCurrencies.find(c => c.code.toLowerCase() === default_currency)?.symbol}` || default_currency}
          </option>
          {countries.data?.supported_bank_account_currencies &&
            Object.keys(supported_bank_account_currencies).map((currency, index) => (
              <option key={currency} value={currency}>
                {`${countryCurrencies.find(c => c.code.toLowerCase() === currency)?.currency} - ${countryCurrencies.find(c => c.code.toLowerCase() === currency)?.symbol}` || currency}
              </option>
            ))}
        </Select>
      </FormControl>
    </Fieldset>
  );
}
export default CurrencyField;