import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../../../organisms/forms/payment-forms/credit-card-payment-form/credit-card-payment-form'

const publishableKey = (process.env.STRIPE_PUBKEY as string) || 'pk_test_12345'
const stripePromise = loadStripe(publishableKey)

const StripeCheckout = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}

export default StripeCheckout
