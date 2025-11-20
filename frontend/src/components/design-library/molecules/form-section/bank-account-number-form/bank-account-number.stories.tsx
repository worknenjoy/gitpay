import React from 'react'
import BankAccountNumberForm from './bank-account-number-form'

export default {
  title: 'Design Library/Molecules/FormSection/BankAccountNumberForm',
  component: BankAccountNumberForm
}

const Template = (args) => <BankAccountNumberForm {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Loading = Template.bind({})
Loading.args = {
  bankAccount: {
    completed: false,
    data: {}
  }
}

export const WithData = Template.bind({})
WithData.args = {
  bankAccount: {
    completed: true,
    data: {
      id: '123456',
      routing_number: '987654321',
      last4: '6789'
    }
  }
}
