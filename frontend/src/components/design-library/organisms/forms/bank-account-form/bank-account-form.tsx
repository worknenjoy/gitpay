import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import ReactPlaceholder from 'react-placeholder';
import AccountTypeField from '../../../../design-library/atoms/inputs/fields/account-type-field/account-type-field';
import CountrySelectField from '../../../../design-library/atoms/inputs/fields/country-select-field/country-select-field';
import BankCurrencyField from '../../../../design-library/atoms/inputs/fields/bank-currency-field/bank-currency-field';
import BankSelectField from '../../../../design-library/atoms/inputs/fields/bank-select-field/bank-select-field';
import Field from '../../../../design-library/atoms/inputs/fields/field/field';
import Button from '../../../../design-library/atoms/buttons/button/button';
import BankAccountNumberForm from '../../../molecules/form-section/bank-account-number-form/bank-account-number-form';
import Alert from '../../../../design-library/atoms/alerts/alert/alert';


const errorMapping = {
  'external_account[account_number]': 'Invalid account number or iban',
  'external_account[routing_number]': 'Invalid routing number',
  'external_account[account_holder_name]': 'Invalid account holder name',
  'external_account[account_holder_type]': 'Invalid account holder type',
  'external_account[bank_name]': 'Invalid bank name',
  'external_account[country]': 'Invalid country',
  'external_account[currency]': 'Invalid currency',
  'external_account[bank_code]': 'Invalid bank code',
  'external_account[account_type]': 'Invalid bank account type',
}

const useStyles = makeStyles((theme) => ({
  placholder: {
    margin: 10
  }
}));

const BankAccountForm = ({
  user,
  bankAccount,
  countries,
  onChangeBankCode,
  onSubmit
}) => {
  const classes = useStyles();
  const { data, completed, error = {} } = bankAccount || {};
  const { id, account_holder_name, account_holder_type, account_number, routing_number, last4, country, currency } = data || {};
  const [ ibanMode, setIbanMode ] = React.useState(false);
  const [ currentCountry, setCurrentCountry ] = React.useState(country);

  const onChangeCountry = (country, requiresIban) => {
    setIbanMode(requiresIban);
    setCurrentCountry(country);
  }

  return (
    <form onSubmit={onSubmit}>
      {error.raw && (
        <Alert
          severity="error"
          style={{ marginBottom: 20, margintTop: 20 }}
          completed={completed}
        >
          <div style={{ marginBottom: 20 }}>
            <FormattedMessage
              id="account.update.error"
              defaultMessage="An error occurred while updating account details:"
            />
          </div>
          <Typography variant="body1" color="error">
            {errorMapping[error.param] ? `${errorMapping[error.param]} - ${error.raw.message}`  : error.raw.message}
          </Typography>
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <ReactPlaceholder className={classes.placholder} type='text' rows={1} ready={completed} showLoadingAnimation>
            <AccountTypeField
              type={account_holder_type}
            />
          </ReactPlaceholder>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ReactPlaceholder className={classes.placholder} type='text' rows={1} ready={completed} showLoadingAnimation>
              <CountrySelectField
                user={user}
                country={currentCountry}
                disabled={!!id}
                onChange={onChangeCountry}
              />
            </ReactPlaceholder>
          </Grid>
          <Grid item xs={12} md={6}>
            <ReactPlaceholder className={classes.placholder} type='text' rows={1} ready={completed} showLoadingAnimation>
              <BankCurrencyField currency={currency} countries={countries} disabled={!!id} />
            </ReactPlaceholder>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <ReactPlaceholder className={classes.placholder} type='text' rows={1} ready={completed} showLoadingAnimation>
              <BankSelectField
                country={currentCountry}
                disabled={!!id}
                onChange={onChangeBankCode}
                routingNumber={routing_number}
              />
            </ReactPlaceholder>
            <Field
              completed={completed}
              label="Account Holder Name"
              name="account_holder_name"
              type="text"
              placeholder="Account holder name / business name"
              defaultValue={account_holder_name}
            />
          </Grid>
        </Grid>
        <BankAccountNumberForm
          bankAccount={bankAccount}
          defaultIbanMode={ibanMode}
        />
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0' }}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          label={<FormattedMessage id='account.actions.update' defaultMessage='Update Bank Account' />}
          disabled={false}
          completed={completed}
        />
      </div>
    </form>
  );
}
export default BankAccountForm;