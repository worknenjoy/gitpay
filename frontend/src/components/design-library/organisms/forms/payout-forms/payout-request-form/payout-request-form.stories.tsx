import React from 'react'
import PayoutRequestForm from './payout-request-form'

export default {
  title: 'Design Library/Organisms/Forms/PayoutForms/PayoutRequestForm',
  component: PayoutRequestForm,
}

const Template = (args) => <PayoutRequestForm {...args} />

export const Default = Template.bind({})
Default.args = {
  balance: 5000,
  currency: 'usd',
}

export const Loading = Template.bind({})
Loading.args = {
  balance: 0,
  currency: 'usd',
  completed: false,
}
