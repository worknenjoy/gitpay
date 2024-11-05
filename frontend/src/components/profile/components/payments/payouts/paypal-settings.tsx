import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  withStyles,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  CardActions,
  Button,
  FormControl,
  Input,
  InputLabel,
} from '@material-ui/core';
import messages from '../../../messages';

const styles = theme => ({
  card: {
    minWidth: 275,
    padding: 10
  },
  cardEmpty: {
    minWidth: 275,
    textAlign: 'center' as 'center',
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
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 700 // 'bold' as a number
  },
  pos: {
    marginBottom: 12
  },
  chip: {
    margin: theme.spacing(1),
  },
  label: {}
})


const PaypalSettings = ({
  intl,
  user,
  updateUser,
  classes,
}) => {

  const handlePaypalAccount = (e) => {
    e.preventDefault()
    updateUser(user.user.id, {
      paypal_id: e.target.paypal_email.value
    })
  }

  if (!user) return <>Needs user</>

  return (
    <form
      onSubmit={handlePaypalAccount}
      style={{ marginTop: 20, marginBottom: 20, width: '100%' }}
    >
      <Card elevation={0} className={classes.card}>
        <CardContent>
          <div className={classes.title}>
            <Typography className={classes.pos} color='textSecondary'>
              <FormattedMessage id='account.register.paypal.title' defaultMessage='Activate PayPal account:' />
            </Typography>
            <Typography component='p' color='textSecondary' style={{ marginBottom: 20, marginTop: 20 }}>
              <FormattedMessage id='account.register.paypal.warning' defaultMessage='When you activate your account with PayPal, you will receive the bounties paid with Paypal in the account that you will provide here. The Paypal taxes will be applied' />
            </Typography>
            {!user.user.paypal_id ? (
              <FormattedMessage id='account.register.paypal.status' defaultMessage='This account is not associated with PayPal'>
                {(msg) => (
                  <Chip
                    label={msg}
                    style={{ marginRight: 20, backgroundColor: 'orange' }}
                  />
                )}
              </FormattedMessage>
            ) : (
              <div>
                <Typography className={classes.pos} color='textSecondary'>
                  <FormattedMessage id='account.register.account.status' defaultMessage='Account status' />
                </Typography>
                <Chip
                  label={intl.formatMessage(messages.activeStatus)}
                  style={{
                    color: 'white',
                    marginRight: 20,
                    backgroundColor: 'green'
                  }}
                />
              </div>
            )}
          </div>
          <Grid item xs={12}>
            <FormControl>
              <InputLabel htmlFor='adornment-password'>
                <FormattedMessage id='account.register.paypay.email' defaultMessage='PayPal registered email' />
              </InputLabel>
              <Input
                name='paypal_email'
                type='email'
                id='email'
                style={{ marginRight: 20 }}
                defaultValue={
                  user.user.paypal_id ? `${user.user.paypal_id}` : `${user.user.email}`
                }
              />
            </FormControl>
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'end' }}>
          <Button
            style={{ color: 'white' }}
            size='large'
            variant='contained'
            color='secondary'
            type='submit'
          >
            {!user.user.paypal_id
              ? <FormattedMessage id='account.register.paypay.activate' defaultMessage='Activate account' />
              : <FormattedMessage id='account.register.paypay.update' defaultMessage='Update account' />
            }
          </Button>
        </CardActions>
      </Card>
    </form>

  );
}

export default injectIntl(withStyles(styles)(PaypalSettings));