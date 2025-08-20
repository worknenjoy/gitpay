import React from 'react';
import { Card, CardActions, CardContent, Chip, FormControl, Grid, Typography, Skeleton } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { makeStyles } from '@mui/styles';
import messages from '../../../../../areas/private/shared/messages';
import Button from '../../../../atoms/buttons/button/button';
import Field from '../../../../atoms/inputs/fields/field/field';


const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    padding: 0,
    margin: 0
  },
  cardEmpty: {
    minWidth: 275,
    textAlign: 'center',
    marginBottom: 40
  },
  cardEmptyActions: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 40
  },
  cardEmptyActionsAlt: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 20
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 'bold'
  },
  pos: {
    marginBottom: 12
  }
}));

const PaypalInfoForm = ({
  user,
  onSubmit
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const { data, completed, error = {} } = user || {};
  const { paypal_id, email } = data || {};

  return (
    <form
      onSubmit={onSubmit}
      style={{ marginTop: 10, marginBottom: 10, width: '100%' }}
    >
      <Card elevation={0} className={classes.card}>
        <CardContent style={{ padding: 0, margin: 0}}>
          <div className={classes.title}>
            <Typography variant="h6" className={classes.pos}>
              <FormattedMessage id="account.register.paypal.title" defaultMessage="Activate PayPal account:" />
            </Typography>
            <Typography component="p" color="textSecondary" style={{ marginBottom: 20, marginTop: 20 }}>
              <FormattedMessage id="account.register.paypal.warning" defaultMessage="When you activate your account with PayPal, you will receive the bounties paid with Paypal in the account that you will provide here. The Paypal taxes will be applied" />
            </Typography>
            <Skeleton variant="text" width={210} height={24} animation="wave" />
          </div>
          <Grid xs={12}>
            <FormControl style={{ width: '42%' }}> 
              <Field
                completed={completed}
                name="paypal_email"
                type="email"
                defaultValue={
                  paypal_id ? `${paypal_id}` : `${email}`
                }
                label={<FormattedMessage id="account.register.paypal.email" defaultMessage="PayPal email" />}
              />
            </FormControl>
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'end' }}>
          <Button
            completed={completed}
            variant="contained"
            color="secondary"
            type="submit"
            label={!paypal_id
              ? <FormattedMessage id="account.register.paypay.activate" defaultMessage="Activate account" />
              : <FormattedMessage id="account.register.paypay.update" defaultMessage="Update account" />}
          />
        </CardActions>
      </Card>
    </form>
  );
}

export default PaypalInfoForm;