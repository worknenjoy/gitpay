import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Card,
  CardContent,
  Typography
} from '@mui/material'
import StripeCheckout from './checkout/stripe-checkout'

class PaymentDialog extends Component {
  render () {
    return (
      <div style={{marginTop: 10}}>
        <Card
          fullWidth
          maxWidth="md"
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <FormattedMessage id="payment.new.title" defaultMessage="Make a new payment" />
            </Typography>
            <Typography variant="body1" gutterBottom>
              <FormattedMessage id="payment.new.text" defaultMessage="Please fill your credit card details" />
            </Typography>
            <StripeCheckout { ...this.props } />
          </CardContent>
        </Card>
      </div>
    )
  }
}

PaymentDialog.propTypes = {
  user: PropTypes.object
}

export default PaymentDialog
