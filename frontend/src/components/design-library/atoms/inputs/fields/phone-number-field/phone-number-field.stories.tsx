import React from 'react'
import PhoneNumberField from './phone-number-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/PhoneNumberField',
  component: PhoneNumberField
}

const Template = (args) => <PhoneNumberField {...args} />

export const Default = Template.bind({})
Default.args = {
  phone: '1234567890'
}

export const Empty = Template.bind({})
Empty.args = {
  phone: ''
}
