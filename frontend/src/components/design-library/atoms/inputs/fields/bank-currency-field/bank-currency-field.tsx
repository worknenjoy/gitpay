import React from 'react'
import { Skeleton, FormControl, Input, Select, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { countryCurrencies } from '../../../../../areas/private/shared/country-codes'

const BankCurrencyField = ({ currency, countries, disabled = false }) => {
  const [currentCurrency, setCurrentCurrency] = React.useState('')
  const [currentCountry, setCurrentCountry] = React.useState('')

  const {
    data: { default_currency, supported_bank_account_currencies },
    completed
  } = countries

  const onChangeCurrency = (e) => {
    e.preventDefault()
    setCurrentCurrency(e.target.value)
  }

  return (
    <FormControl style={{ width: '100%' }}>
      <div>
        <Typography variant="caption" gutterBottom>
          <FormattedMessage
            id="account.register.bank.account.currency"
            defaultMessage="Currency:"
          />
        </Typography>
      </div>
      {completed ? (
        <Select
          native
          name="bank_account_currency"
          defaultValue={currency ? currency?.toUpperCase() : default_currency?.toUpperCase() || ''}
          input={<Input id="bank-currency" />}
          fullWidth
          style={{ marginTop: 12, marginBottom: 12 }}
          onChange={onChangeCurrency}
          disabled={disabled}
        >
          <option value="">Select currency</option>
          {countryCurrencies.map((c, index) => (
            <option key={index} value={c.code}>{`${c.currency} - ${c.symbol}`}</option>
          ))}
        </Select>
      ) : (
        <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
      )}
    </FormControl>
  )
}

export default BankCurrencyField
