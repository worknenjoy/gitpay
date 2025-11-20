import React from 'react'
import BankSelectField from './bank-select-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/BankSelectField',
  component: BankSelectField,
}

const Template = (args) => <BankSelectField {...args} />

export const Default = Template.bind({})
Default.args = {
  routingNumber: '123456789',
  country: 'BR',
  onChange: (e) => console.log(e.target.value),
  disabled: false,
}
