import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Card, CardContent, Typography } from '@mui/material'
import StripeCheckout from './stripe-checkout'

type CreditCardPaymentCardProps = React.ComponentProps<typeof StripeCheckout>

const CreditCardPaymentCard: React.FC<CreditCardPaymentCardProps> = (props) => {
  return (
    <div style={{ marginTop: 10 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="payment.new.title" defaultMessage="Make a new payment" />
          </Typography>
          <Typography variant="body1" gutterBottom>
            <FormattedMessage
              id="payment.new.text"
              defaultMessage="Please fill your credit card details"
            />
          </Typography>
          <StripeCheckout {...props} />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreditCardPaymentCard
