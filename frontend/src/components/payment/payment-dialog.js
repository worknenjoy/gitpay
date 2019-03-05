import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'
import StripeCheckout from '../checkout/stripe-checkout'

class PaymentDialog extends Component {
  render () {
    return (
      <Dialog
        open={ this.props.open }
        onClose={ this.props.onClose }
        aria-labelledby='alert-dialog-payment-title'
        aria-describedby='alert-dialog-payment-description'
        fullWidth
        maxWidth='md'
      >
        <DialogTitle id='alert-dialog-payment-title'>
          <FormattedMessage id='payment.new.title' defaultMessage='Make a new payment' />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-payment-description'>
            <FormattedMessage id='payment.new.text' defaultMessage='Please fill your credit card details' />
          </DialogContentText>
          <StripeCheckout { ...this.props } />
        </DialogContent>
      </Dialog>
    )
  }
}

PaymentDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object
}

export default PaymentDialog
