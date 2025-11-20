import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import CheckoutForm from './credit-card-payment-form'

const publishableKey = (process.env.STRIPE_PUBKEY as string) || 'pk_test_12345'
const stripePromise = loadStripe(publishableKey)

export default {
  title: 'Design Library/Organisms/Forms/PaymentForms/CreditCardPaymentForm',
  component: CheckoutForm,
  decorators: [
    (Story) => (
      <Elements stripe={stripePromise}>
        <div
          style={{
            maxWidth: 520,
            margin: '2rem auto',
            padding: '1rem',
            border: '1px solid #eee',
            borderRadius: 8,
          }}
        >
          <Story />
        </div>
      </Elements>
    ),
  ],
}

const Template = (args) => <CheckoutForm {...args} />

export const Default = Template.bind({})
Default.args = {
  task: 123,
  plan: 'basic',
  price: 20,
  formatedPrice: '$20.00',
  user: {},
  couponStoreState: {
    completed: true,
    coupon: { amount: 0, orderPrice: 20 },
  },
  onPayment: () => {},
  onClose: () => {},
  addNotification: () => {},
  validateCoupon: () => {},
}

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  ...Default.args,
  user: { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
}
