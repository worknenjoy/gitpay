import React from 'react'
import CheckoutFootNote from './checkout-foot-note'

export default {
  title: 'Design Library/Atoms/Checkout/CheckoutFootNote',
  component: CheckoutFootNote
}

const Template = (args) => <CheckoutFootNote {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Payments are processed securely by Whop.'
}
