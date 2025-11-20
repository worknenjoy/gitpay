import React from 'react'
import UserBasicInfoFormSection from './user-basic-info-form-section'

export default {
  title: 'Design Library/Molecules/FormSection/UserBasicInfoForm',
  component: UserBasicInfoFormSection,
}

const Template = (args) => <UserBasicInfoFormSection {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Prefilled = Template.bind({})
Prefilled.args = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
}

export const EmailLocked = Template.bind({})
EmailLocked.args = {
  email: 'locked@example.com',
}

export const WithErrors = Template.bind({})
WithErrors.args = {
  error: {
    fullname: true,
    email: true,
  },
}
