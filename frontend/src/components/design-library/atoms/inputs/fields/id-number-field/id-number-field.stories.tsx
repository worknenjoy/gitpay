import React from 'react'
import IdNumberField from './id-number-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/IdNumberField',
  component: IdNumberField,
}

const Template = (args) => <IdNumberField {...args} />

export const Default = Template.bind({})
Default.args = {
  account: {
    data: {
      'individual[id_number]': '123456789',
      individual: {
        id_number_provided: false,
      },
    },
    completed: true,
  },
}
