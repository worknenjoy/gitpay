import React from 'react'
import { Grid, Typography } from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import Button from '../../../../atoms/buttons/button/button'
import Field from '../../../../atoms/inputs/fields/field/field'
import {
  Form,
  Card,
  CardContent,
  Title,
  Pos,
  FullWidthFormControl,
  RightActions,
} from './paypal-info-form.styles'

const PaypalInfoForm = ({ user, onSubmit }) => {
  const intl = useIntl()
  const { data, completed, error = {} } = user || {}
  const { paypal_id, email } = data || {}

  return (
    <Form onSubmit={onSubmit}>
      <Card elevation={0}>
        <CardContent>
          <Title>
            <Typography variant="h6" component={Pos}>
              <FormattedMessage
                id="account.register.paypal.title"
                defaultMessage="Activate PayPal account:"
              />
            </Typography>
            <Typography component="p" color="textSecondary" sx={{ my: 2 }}>
              <FormattedMessage
                id="account.register.paypal.warning"
                defaultMessage="When you activate your account with PayPal, you will receive the bounties paid with Paypal in the account that you will provide here. The Paypal taxes will be applied"
              />
            </Typography>
          </Title>
          <Grid size={{ xs: 12 }}>
            <FullWidthFormControl>
              <Field
                completed={completed}
                name="paypal_email"
                type="email"
                defaultValue={paypal_id ? `${paypal_id}` : `${email}`}
                label={
                  <FormattedMessage
                    id="account.register.paypal.email"
                    defaultMessage="PayPal email"
                  />
                }
              />
            </FullWidthFormControl>
          </Grid>
        </CardContent>
        <RightActions>
          <Button
            completed={completed}
            variant="contained"
            color="secondary"
            type="submit"
            label={
              !paypal_id ? (
                <FormattedMessage
                  id="account.register.paypay.activate"
                  defaultMessage="Activate account"
                />
              ) : (
                <FormattedMessage
                  id="account.register.paypay.update"
                  defaultMessage="Update account"
                />
              )
            }
          />
        </RightActions>
      </Card>
    </Form>
  )
}

export default PaypalInfoForm
