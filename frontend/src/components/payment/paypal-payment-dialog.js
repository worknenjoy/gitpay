import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
} from '@material-ui/core'

class PaypalPaymentDialog extends Component {
  state = {
    termsPaypal: false
  }

  componentWillMount () { }

  handleNewOrder = (e) => {
    e.preventDefault()
    if (this.state.termsPaypal) {
      this.props.createOrder({
        provider: 'paypal',
        currency: 'USD',
        amount: this.props.itemPrice,
        userId: this.props.user.id,
        TaskId: this.props.task
      }).then(order => {
        this.triggerPayment(this.props.order.data)
      })
    }
  }

  triggerPayment (order) {
    window.location.href = order.payment_url
  }

  agreeTermsPaypal = () => {
    this.setState({ termsPaypal: !this.state.termsPaypal })
  }

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
          <FormattedMessage id='payment.paypal.title' defaultMessage='Make a new payment with Paypal' />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-payment-description'>
            <FormattedMessage id='payment.paypal.description' defaultMessage='Remember that the assigned for this task will receive the payment with Paypal as well.' />
            <div style={ {
              margin: 'auto',
              textAlign: 'center',
              width: '50%',
              marginTop: 40,
              fontFamily: 'Roboto',
              background: '#ecf0f1',
              padding: 20
            } }>
              <FormattedMessage id='payment.paypal.warning' defaultMessage='Remember that the assigned for this task will receive the payment with Paypal as well.' />
            </div>
            <div style={ { textAlign: 'center' } }>
              <FormattedMessage id='payment.paypal.confirm' defaultMessage='Ok, I accept.' />
              <Checkbox onChange={ this.agreeTermsPaypal } />
            </div>
          </DialogContentText>
          { !this.props.order.completed ? (
            'Requesting'
          ) : (
            <div style={ { textAlign: 'center', width: '100%', marginTop: 40, fontFamily: 'Roboto' } }>
              <FormattedMessage id='payment.paypal.paywith' defaultMessage='Pay with ' />
              <br />
              <FormattedMessage id='payment.paypal.logo.title' defaultMessage='Make the payment with paypal'>
                { (msg) => (
                  <a href='#' title={ msg } onClick={ this.handleNewOrder }>
                    <img src='https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg' border='0' alt='PayPal Logo' />
                  </a>
                ) }
              </FormattedMessage>
            </div>
          ) }
        </DialogContent>
      </Dialog>
    )
  }
}

PaypalPaymentDialog.propTypes = {
  task: PropTypes.string,
  open: PropTypes.bool,
  user: PropTypes.object.isRequired,
  createOrder: PropTypes.func,
  onClose: PropTypes.func,
  order: PropTypes.object.isRequired,
  itemPrice: PropTypes.any
}

export default PaypalPaymentDialog
