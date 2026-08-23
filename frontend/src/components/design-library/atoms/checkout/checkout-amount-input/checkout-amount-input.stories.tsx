import React, { useState } from 'react'
import CheckoutAmountInput from './checkout-amount-input'

export default {
  title: 'Design Library/Atoms/Checkout/CheckoutAmountInput',
  component: CheckoutAmountInput
}

const Template = (args) => {
  const [value, setValue] = useState(args.value)
  return <CheckoutAmountInput {...args} value={value} onChange={setValue} />
}

export const Default = Template.bind({})
Default.args = {
  value: '',
  currency: 'usd'
}

export const WithValue = Template.bind({})
WithValue.args = {
  value: '25.00',
  currency: 'usd'
}

export const Disabled = Template.bind({})
Disabled.args = {
  value: '25.00',
  currency: 'usd',
  disabled: true
}

export const LeftAligned = Template.bind({})
LeftAligned.args = {
  value: '25.00',
  currency: 'usd',
  align: 'left'
}

export const RightAligned = Template.bind({})
RightAligned.args = {
  value: '25.00',
  currency: 'usd',
  align: 'right'
}
