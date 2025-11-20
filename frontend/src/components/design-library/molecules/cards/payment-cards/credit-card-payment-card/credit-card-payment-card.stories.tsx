import React from 'react'
import CreditCardPaymentCard from './credit-card-payment-card'

export default {
  title: 'Design Library/Molecules/Cards/PaymentCards/CreditCardPaymentCard',
  component: CreditCardPaymentCard,
}

const Template = (args) => (
  <div style={{ maxWidth: 560, margin: '2rem auto' }}>
    <CreditCardPaymentCard {...args} />
  </div>
)

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
