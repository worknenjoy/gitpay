import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React from 'react'
import { FormattedMessage } from 'react-intl'

const AccountTypeField = ({ disabled = false, type = 'individual' }) => {
  const [bankAccountType, setBankAccountType] = React.useState(type)

  return (
    <FormControl component="fieldset">
      <Typography variant="caption" gutterBottom>
        <FormattedMessage id="account.register.type" defaultMessage="Account Type:" />
      </Typography>
      <RadioGroup
        aria-label="bankAccountType"
        name="bank_account_type"
        value={bankAccountType}
        onChange={(e) => setBankAccountType(e.target.value)}
        row
      >
        <FormControlLabel
          value="individual"
          control={<Radio color="primary" />}
          label={<FormattedMessage id="account.type.individual" defaultMessage="Individual" />}
          disabled={disabled}
        />
        <FormControlLabel
          value="company"
          control={<Radio color="primary" />}
          label={<FormattedMessage id="account.type.company" defaultMessage="Company" />}
          disabled={disabled}
        />
      </RadioGroup>
    </FormControl>
  )
}
export default AccountTypeField
