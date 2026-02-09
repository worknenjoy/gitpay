import React, { useEffect } from 'react'
import { Grid, Typography, Checkbox } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import AccountTypeField from '../../../../atoms/inputs/fields/account-type-field/account-type-field'
import CountrySelectField from '../../../../atoms/inputs/fields/country-select-field/country-select-field'
import BankCurrencyField from '../../../../atoms/inputs/fields/bank-currency-field/bank-currency-field'
import BankSelectField from '../../../../atoms/inputs/fields/bank-select-field/bank-select-field'
import Field from '../../../../atoms/inputs/fields/field/field'
import Button from '../../../../atoms/buttons/button/button'
import BankAccountNumberForm from '../../../../molecules/form-section/bank-account-number-form/bank-account-number-form'
import Alert from '../../../../atoms/alerts/alert/alert'
import ProfileSecondaryHeader from '../../../../molecules/headers/profile-secondary-header/profile-secondary-header'
import BankAccountStatus from '../../../../atoms/status/account-status/bank-account-status/bank-account-status'

const errorMapping = {
  'external_account[account_number]': 'Invalid account number or iban',
  'external_account[routing_number]': 'Invalid routing number',
  'external_account[account_holder_name]': 'Invalid account holder name',
  'external_account[account_holder_type]': 'Invalid account holder type',
  'external_account[bank_name]': 'Invalid bank name',
  'external_account[country]': 'Invalid country',
  'external_account[currency]': 'Invalid currency',
  'external_account[bank_code]': 'Invalid bank code',
  'external_account[account_type]': 'Invalid bank account type'
}

const BankAccountForm = ({
  user,
  bankAccount,
  countries,
  onChangeBankCode,
  onSubmit,
  submitLabel
}) => {
  const { data, completed, error = {} } = bankAccount || {}
  const {
    id,
    status,
    account_holder_name,
    account_holder_type,
    routing_number,
    country,
    currency,
    default_for_currency
  } = data || {}
  const [ibanMode, setIbanMode] = React.useState(false)
  const [currentCountry, setCurrentCountry] = React.useState(country)

  const onChangeCountry = (country, requiresIban) => {
    setIbanMode(requiresIban)
    setCurrentCountry(country)
  }

  return (
    <form onSubmit={onSubmit}>
      <ProfileSecondaryHeader
        title={
          <FormattedMessage
            id="payout-settings.bank-account-info.title"
            defaultMessage="Bank account information"
          />
        }
        subtitle={
          <FormattedMessage
            id="payout-settings.bank-account-info.description"
            defaultMessage="Please provide your bank account activation to receive payouts"
          />
        }
        aside={<BankAccountStatus status={status} completed={completed} />}
      />
      {error.raw && (
        <Alert severity="error" style={{ marginBottom: 20, margintTop: 20 }} completed={completed}>
          <div style={{ marginBottom: 20 }}>
            <FormattedMessage
              id="account.update.error"
              defaultMessage="An error occurred while updating account details:"
            />
          </div>
          <Typography variant="body1" color="error">
            {errorMapping[error.param]
              ? `${errorMapping[error.param]} - ${error.raw.message}`
              : error.raw.message}
          </Typography>
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Checkbox
            name="default_for_currency"
            defaultChecked={default_for_currency}
          />
          <Typography variant="body2" display="inline">
            <FormattedMessage
              id="bankAccounts.defaultForCurrency"
              defaultMessage="Set as default for this currency"
            />
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <AccountTypeField type={account_holder_type} />
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CountrySelectField
              user={user}
              country={currentCountry}
              disabled={!!id}
              onChange={onChangeCountry}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <BankCurrencyField currency={currency} countries={countries} disabled={!!id} />
          </Grid>
        </Grid>
        <BankSelectField
          country={currentCountry}
          disabled={!!id}
          onChange={onChangeBankCode}
          routingNumber={routing_number}
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            <div style={{ marginTop: 17 }}>
              <Field
                completed={completed}
                label="Account Holder Name"
                name="account_holder_name"
                type="text"
                placeholder="Account holder name / business name"
                defaultValue={account_holder_name}
              />
            </div>
          </Grid>
        </Grid>
        <div style={{ marginTop: 17 }}>
          <BankAccountNumberForm bankAccount={bankAccount} defaultIbanMode={ibanMode} />
        </div>
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0' }}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          label={
            submitLabel ?? (
              <FormattedMessage id="account.actions.update" defaultMessage="Update Bank Account" />
            )
          }
          disabled={false}
          completed={completed}
        />
      </div>
    </form>
  )
}
export default BankAccountForm
