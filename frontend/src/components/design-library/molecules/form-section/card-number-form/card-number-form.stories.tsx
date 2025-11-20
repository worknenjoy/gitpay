import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import CardPaymentForm from './card-number-form'

const publishableKey = (process.env.STRIPE_PUBKEY as string) || 'pk_test_12345'
const stripePromise = loadStripe(publishableKey)

export default {
  title: 'Design Library/Molecules/FormSection/CardNumberForm',
  component: CardPaymentForm,
  decorators: [
    (Story) => (
      <Elements stripe={stripePromise}>
        <div
          style={{
            maxWidth: 420,
            margin: '2rem auto',
            padding: '1rem',
            border: '1px solid #eee',
            borderRadius: 8
          }}
        >
          <Story />
        </div>
      </Elements>
    )
  ]
}

const Template = (args) => <CardPaymentForm {...args} />

export const Primary = Template.bind({})
Primary.args = {}
