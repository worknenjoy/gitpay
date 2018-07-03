import React, { Component } from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import CheckoutForm from './checkout-form'

class StripeCheckout extends Component {
  constructor (props) {
    super(props)
    this.state = { stripe: null }
  }

  componentWillMount () {}

  render () {
    return (
      <StripeProvider apiKey={ process.env.STRIPE_PUBKEY }>
        <Elements>
          <CheckoutForm { ...this.props } />
        </Elements>
      </StripeProvider>
    )
  }
}

export default StripeCheckout
