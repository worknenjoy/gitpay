import React from 'react'
import CheckoutMerchantSummary from './checkout-merchant-summary'

export default {
  title: 'Design Library/Molecules/Checkout/CheckoutMerchantSummary',
  component: CheckoutMerchantSummary
}

const Template = (args) => <CheckoutMerchantSummary {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'React performance audit & fixes',
  description: 'Payment request from gitpay.me'
}

export const WithoutDescription = Template.bind({})
WithoutDescription.args = {
  title: 'React performance audit & fixes'
}
