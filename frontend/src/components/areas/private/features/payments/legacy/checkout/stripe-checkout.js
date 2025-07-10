import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../../../../../../../containers/checkout-form'

const stripePromise = loadStripe(process.env.STRIPE_PUBKEY)

const StripeCheckout = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}

export default StripeCheckout
