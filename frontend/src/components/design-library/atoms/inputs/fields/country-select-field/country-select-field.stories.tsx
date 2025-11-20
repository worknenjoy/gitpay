import React from 'react'
import CountrySelectField from './country-select-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/CountrySelectField',
  component: CountrySelectField,
}

const Template = (args) => <CountrySelectField {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    data: {
      country: 'BR',
    },
  },
  bank_account: {
    data: {
      routing_number: '123456',
    },
  },
}
