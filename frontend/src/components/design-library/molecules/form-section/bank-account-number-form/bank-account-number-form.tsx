import { FormControl, FormControlLabel, Grid, Switch } from '@mui/material'
import React from 'react'
import Field from '../../../atoms/inputs/fields/field/field'
import { FormattedMessage } from 'react-intl'

const BankAccountNumberForm = ({ bankAccount, defaultIbanMode }) => {
  const { data, completed } = bankAccount || {}
  const { id, account_number, routing_number, last4 } = data || {}
  const [ibanMode, setIbanMode] = React.useState(defaultIbanMode)

  const handleIbanModeChange = (event) => {
    setIbanMode(event.target.checked)
  }

  return (
    <Grid container spacing={2}>
      {ibanMode || defaultIbanMode ? (
        <Grid size={{ xs: 12, md: 12 }}>
          <Field
            completed={completed}
            label="IBAN"
            name="account_number"
            type="text"
            placeholder="Enter your IBAN number"
            disabled={id}
            defaultValue={last4 ? `**************${last4}` : account_number}
            required
          />
        </Grid>
      ) : (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field
              completed={completed}
              label="Routing Number"
              name="routing_number"
              type="text"
              placeholder="Enter your routing number"
              disabled={id}
              defaultValue={routing_number}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field
              completed={completed}
              label="Account Number"
              name="account_number"
              type="text"
              placeholder="Enter your account number"
              disabled={id}
              defaultValue={last4 ? `******${last4}` : account_number}
              required
            />
          </Grid>
        </>
      )}
      {!defaultIbanMode && (
        <Grid size={{ xs: 12 }}>
          <FormControl style={{ width: '100%' }} disabled={id}>
            <FormControlLabel
              control={
                <Switch
                  name="iban"
                  checked={ibanMode}
                  onChange={handleIbanModeChange}
                  value="iban"
                  color="primary"
                  disabled={id}
                />
              }
              label={
                <FormattedMessage
                  id="account.details.bank.mode.iban"
                  defaultMessage="I want to provide my IBAN number instead"
                />
              }
            />
          </FormControl>
        </Grid>
      )}
    </Grid>
  )
}

export default BankAccountNumberForm
