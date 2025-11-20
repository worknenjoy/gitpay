import React from 'react'
import BirthDateField from './birth-date-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/BirthDateField',
  component: BirthDateField,
}

const Template = (args) => <BirthDateField {...args} />

export const Default = Template.bind({})
Default.args = {}

export const PreFilled = Template.bind({})
PreFilled.args = {
  day: 15,
  month: 8,
  year: 1990,
}
