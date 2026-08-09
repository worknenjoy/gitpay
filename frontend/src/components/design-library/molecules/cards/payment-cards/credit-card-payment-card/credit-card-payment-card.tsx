import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Card, CardContent, Typography } from '@mui/material'
import StripeCheckout from './stripe-checkout'
import WhopCheckout from './whop-checkout'

type CreditCardPaymentCardProps = React.ComponentProps<typeof StripeCheckout> & {
  createOrder?: any
}

const paymentProvider = (process.env.PAYMENT_PROVIDER as string) || 'stripe'

const CreditCardPaymentCard: React.FC<CreditCardPaymentCardProps> = (props) => {
  const isWhop = paymentProvider === 'whop'

  return (
    <div style={{ marginTop: 10 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="payment.new.title" defaultMessage="Make a new payment" />
          </Typography>
          <Typography variant="body1" gutterBottom>
            {isWhop ? (
              <FormattedMessage
                id="payment.new.text.whop"
                defaultMessage="Complete payment with Whop checkout"
              />
            ) : (
              <FormattedMessage
                id="payment.new.text"
                defaultMessage="Please fill your credit card details"
              />
            )}
          </Typography>
          {isWhop ? <WhopCheckout {...props} /> : <StripeCheckout {...props} />}
        </CardContent>
      </Card>
    </div>
  )
}

export default CreditCardPaymentCard
