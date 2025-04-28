import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import ReactPlaceholder from 'react-placeholder';
import AccountTypeField from '../../../../design-library/atoms/inputs/fields/account-type-field/account-type-field';
import CountrySelectField from '../../../../design-library/atoms/inputs/fields/country-select-field/country-select-field';
import CurrencySelectField from '../../../../design-library/atoms/inputs/fields/bank-currency-field/bank-currency-field';
import BankSelectField from '../../../../design-library/atoms/inputs/fields/bank-select-field/bank-select-field';
import Field from '../../../../design-library/atoms/inputs/fields/field/field';
import Button from '../../../../design-library/atoms/buttons/button/button';


const useStyles = makeStyles((theme) => ({
  placholder: {
    margin: 10
  }
}));

const BankAccountForm = ({
  user,
  bankAccount,
  countries,
  onSubmit
}) => {
  const classes = useStyles();
  const { data, completed } = bankAccount || {};
  const { account_holder_name, account_holder_type, account_number, routing_number, last4 } = data || {};

  return (
    <form onSubmit={onSubmit}>
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
              />
            </ReactPlaceholder>
          </Grid>
          <Grid item xs={12} md={6}>
            <ReactPlaceholder className={classes.placholder} type='text' rows={1} ready={completed} showLoadingAnimation>
              <CurrencySelectField countries={countries} />
            </ReactPlaceholder>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <ReactPlaceholder className={classes.placholder} type='text' rows={1} ready={completed} showLoadingAnimation>
              <BankSelectField
                user={user}
              />
            </ReactPlaceholder>
            <Field
              completed={completed}
              label="Account Holder Name"
              name="account_holder_name"
              type="text"
              placeholder="Account holder name / business name"
              value={account_holder_name}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Field
              completed={completed}
              label="Routing Number"
              name="routing_number"
              type="text"
              placeholder="Enter your routing number"
              value={routing_number}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field
              completed={completed}
              label="Account Number"
              name="account_number"
              type="text"
              placeholder="Enter your account number"
              value={last4 ? `******${last4}` : account_number}
            />
          </Grid>
        </Grid>
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