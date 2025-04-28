import { FormControl, Input, Select, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import { countryCodes } from '../../../../../areas/private/shared/country-codes'
import ReactPlaceholder from "react-placeholder";

const CountrySelectField = ({ user, country, disabled = false }) => {
  const { data = {}, completed } = user;
  const { country: userCountry } = data;

  const [currentCountry, setCurrentCountry] = React.useState(country);

  const onChangeCountry = (e) => {
    e.preventDefault()
    setCurrentCountry(e.target.value)
  }

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