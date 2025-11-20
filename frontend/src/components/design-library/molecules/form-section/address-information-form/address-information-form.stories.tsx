import React from 'react'
import AddressInformationForm from './address-information-form'

export default {
  title: 'Design Library/Molecules/FormSection/AddressInformationForm',
  component: AddressInformationForm
}

const Template = (args) => <AddressInformationForm {...args} />

export const Default = Template.bind({})
Default.args = {
  completed: true,
  addressLine1: '123 Main St',
  addressLine2: 'Apt 4B',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'US'
}
