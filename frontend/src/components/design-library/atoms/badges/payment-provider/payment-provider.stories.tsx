import React from 'react'

import PaymentProvider from './payment-provider'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Atoms/Badges/PaymentProvider',
  component: PaymentProvider,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <PaymentProvider {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  provider: 'stripe',
  sourceType: 'card',
}

export const Card = Template.bind({})
Card.args = {
  provider: 'stripe',
  sourceType: 'card',
}

export const Invoice = Template.bind({})
Invoice.args = {
  provider: 'stripe',
  sourceType: 'invoice-item',
}

export const Paypal = Template.bind({})
Paypal.args = {
  provider: 'paypal',
  sourceType: 'unknown',
}

export const Wallet = Template.bind({})
Wallet.args = {
  provider: 'wallet',
  sourceType: 'unknown',
}

export const Unknown = Template.bind({})
Unknown.args = {
  provider: 'unknown',
  sourceType: 'unknown',
}
