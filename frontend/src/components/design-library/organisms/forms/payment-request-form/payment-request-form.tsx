import React from 'react';
import { Grid, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import Field from '../../../atoms/inputs/fields/field/field';
import Alert from '../../../atoms/alerts/alert/alert';

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

const useStyles = makeStyles((theme) => ({
  placholder: {
    margin: 10
  }
}));

const PaymentRequestForm = ({
  user,
  paymentRequest,
  onSubmit
}) => {
  const classes = useStyles();
  const { data, completed, error = {} } = paymentRequest || {};
  const { title, description, amount } = data || {};

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
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              completed={completed}
              label="Title"
              name="title"
              type="text"
              placeholder="Title of your service"
              defaultValue={title}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Description"
              name="description"
              placeholder="Describe your service"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              completed={completed}
              label="Amount"
              name="amount"
              type="number"
              placeholder="Enter the amount"
              defaultValue={amount}
              inputProps={{ min: 0, step: "0.01" }}
              endAdornment={
                <div style={{ marginLeft: 8 }}>
                  <i><FormattedMessage id="currency" defaultMessage="USD" /></i>
                </div>
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
export default PaymentRequestForm;