import React from 'react'
import PersonalDetailsForm from './personal-details-form'

export default {
  title: 'Design Library/Molecules/FormSection/PersonalDetailsForm',
  component: PersonalDetailsForm
}

const Template = (args) => <PersonalDetailsForm {...args} />

export const Default = Template.bind({})
Default.args = {
  account: {
    completed: true,
    data: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }
}
