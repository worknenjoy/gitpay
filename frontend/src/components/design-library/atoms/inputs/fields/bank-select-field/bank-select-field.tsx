import { FormControl, FormHelperText, MenuItem, Select, Typography } from '@material-ui/core';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Const from '../../../../../../consts';

const BankSelectField = ({ user, disabled }) => {
  const { data = {} } = user;
  const { country } = data;
  const [selectedBank, setSelectedBank] = React.useState('');
  const [bankNumberError, setBankNumberError] = React.useState(false);

  const handleBankNumberSelect = (e) => {
    setSelectedBank(e.target.value)
    setBankNumberError(false)
  }

  return (
    Const.BANK_NUMBERS[country] ?
      <FormControl style={{ width: '100%' }}>
        <div>
          <Typography variant='caption' gutterBottom>
            <FormattedMessage id='account.register.bank.name' defaultMessage='Choose your local bank name:' />
          </Typography>
        </div>
        <Select
          value={selectedBank}
          displayEmpty
          name='bankCode'
          onChange={handleBankNumberSelect}
          style={{ marginTop: 12, marginBottom: 12 }}
          disabled={disabled}
        >
          <MenuItem value='' disabled>
            <em>
              <FormattedMessage id='account.banks.list.title' defaultMessage='Select your bank' />
            </em>
          </MenuItem>
          {Object.keys(Const.BANK_NUMBERS[country]).map(
            (item, i) => {
              return (
                <MenuItem key={i} value={item}>{`${Const.BANK_NUMBERS[country][item]
                  }`}
                </MenuItem>
              )
            }
          )}
        </Select>
        {bankNumberError && (
          <FormHelperText>
            {' '}
            <FormattedMessage id='account.bank.select' defaultMessage='Please select your bank' />
          </FormHelperText>
        )}
      </FormControl>
      : <></>
  );
}
export default BankSelectField;