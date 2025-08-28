import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Typography
} from '@mui/material'

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
        amount: this.props.price,
        plan: this.props.plan,
        userId: this.props.user.id,
        taskId: this.props.taskId
      }).then(order => {
        if (order) {
          // eslint-disable-next-line no-console
          console.log('Paypal order order', order)
          this.triggerPayment(this.props.order.data)
        }
        else {
          // eslint-disable-next-line no-console
          console.log('no paypal order', order)
        }
      }).catch(e => {
        // eslint-disable-next-line no-console
        console.log('failed paypal order', e)
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
      <Card
        fullWidth
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="payment.paypal.title" defaultMessage="Make a new payment with Paypal" />
          </Typography>
          <div>
            <Typography variant="body1" gutterBottom>
              <FormattedMessage id="payment.paypal.subtitle" defaultMessage="The user who solves this issue, once they activate their PayPal account on Gitpay, will be able to receive payment via PayPal" />
            </Typography>
            <div style={ {
              margin: 'auto',
              textAlign: 'center',
              width: '50%',
              marginTop: 40,
              background: '#ecf0f1',
              padding: 20
            } }>
              <Typography variant="body1" gutterBottom>
                <FormattedMessage id="payment.paypal.warning2" defaultMessage="By continuing with PayPal, you will initiate a pre-authorized payment. We will authorize the payment afterwards, and you will receive a confirmation from Paypal" />
              </Typography>
            </div>
            <div style={ { textAlign: 'center' } }>
              <Typography variant="body1" gutterBottom>
                <Checkbox onChange={ this.agreeTermsPaypal } />
                <FormattedMessage id="payment.paypal.confirm" defaultMessage="Ok, I accept." />
              </Typography>
            </div>
          </div>
          { !this.props.order.completed ? (
            'Requesting'
          ) : (
            <div style={ { textAlign: 'center', width: '100%', marginTop: 20 } }>
              <FormattedMessage id="payment.paypal.logo.title" defaultMessage="Make the payment with paypal">
                { (msg) => (
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={ !this.state.termsPaypal || this.props.price === 0 }
                    onClick={ this.handleNewOrder }
                    
                  >
                    <span style={{marginRight: 10, display: 'inline-block'}}>
                      {msg}
                    </span>
                    <img width={32} height={19} src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg" border="0" alt="PayPal Logo" />
                  </Button>
                ) }
              </FormattedMessage>
            </div>
          ) }
        </CardContent>
      </Card>
    )
  }
}

PaypalPaymentDialog.propTypes = {
  taskId: PropTypes.number,
  user: PropTypes.object.isRequired,
  createOrder: PropTypes.func,
  onClose: PropTypes.func,
  order: PropTypes.object.isRequired,
  price: PropTypes.any
}

export default PaypalPaymentDialog
