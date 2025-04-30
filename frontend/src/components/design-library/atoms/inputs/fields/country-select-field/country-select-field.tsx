import React, { useEffect } from "react";
import { FormControl, Input, Select, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { countryCodes, SEPA_COUNTRIES } from '../../../../../areas/private/shared/country-codes'
import ReactPlaceholder from "react-placeholder";

const CountrySelectField = ({ user, country, onChange, disabled = false }) => {
  const { data = {}, completed } = user;
  const { country: userCountry } = data;

  const [currentCountry, setCurrentCountry] = React.useState(country);

  const requiresIban = (countryCode) => {
    return countryCode && SEPA_COUNTRIES.includes(countryCode.toUpperCase());
  }

  const onChangeCountry = (e) => {
    e.preventDefault()
    setCurrentCountry(e.target.value)
    onChange(e.target.value, requiresIban(e.target.value))
  }

  useEffect(() => {
    onChange(userCountry, requiresIban(userCountry));
  }, []);

  return (
    <FormControl style={{ width: '100%' }}>
      <div>
        <Typography variant='caption' gutterBottom>
          <FormattedMessage id='account.register.bank.account.country' defaultMessage='Country:' />
        </Typography>
      </div>
      <ReactPlaceholder type='text' rows={1} ready={completed}>
        <Select
          native
          name='bank_account_country'
          value={currentCountry}
          defaultValue={userCountry}
          input={<Input id='bank-country' />}
          fullWidth
          style={{ marginTop: 12, marginBottom: 12 }}
          onChange={onChangeCountry}
          disabled={disabled}
        >
          <option value=''>
            Select bank country
          </option>
          {countryCodes.map((c, index) => (
            <option key={index} value={c.code} selected={user.country === c.code}>{c.country}</option>
          ))}
        </Select>
      </ReactPlaceholder>
    </FormControl>
  );
}
export default CountrySelectField;