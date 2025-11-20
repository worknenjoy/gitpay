import React from 'react'
import PaymentRequestForm from './payment-request-form'

export default {
  title: 'Design Library/Organisms/Forms/PaymentRequestForms/PaymentRequestForm',
  component: PaymentRequestForm,
}

const Template = (args) => <PaymentRequestForm {...args} />

export const Default = Template.bind({})
Default.args = {
  completed: true,
}

export const Edit = Template.bind({})
Edit.args = {
  completed: true,
  paymentRequest: {
    completed: true,
    data: {
      id: 1,
      active: true,
      amount: 100,
      currency: 'USD',
      title: 'Web Development Services',
      description: 'Payment for services rendered',
    },
  },
}

export const Loading = Template.bind({})
Loading.args = {
  completed: false,
}
