import React, { Component } from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import CheckoutForm from './checkout-form'

class StripeCheckout extends Component {
  render () {
    return (
      <StripeProvider apiKey={ process.env.STRIPE_PUBKEY || null }>
        <Elements>
          <CheckoutForm { ...this.props } />
        </Elements>
      </StripeProvider>
    )
  }
}

export default StripeCheckout
