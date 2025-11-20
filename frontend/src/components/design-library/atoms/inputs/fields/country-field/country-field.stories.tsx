import React from 'react'
import CountryField from './country-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/CountryField',
  component: CountryField,
}

const Template = (args) => <CountryField {...args} />

export const Default = Template.bind({})
Default.args = {
  country: 'BR',
  completed: true,
}

export const Loading = Template.bind({})
Loading.args = {
  country: 'BR',
  completed: false,
}
