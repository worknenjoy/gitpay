import React from 'react'
import AccountTypeField from './account-type-field'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/AccountTypeField',
  component: AccountTypeField
}

const Template = (args) => <AccountTypeField {...args} />

export const Default = Template.bind({})
Default.args = {
  disabled: false,
  type: 'individual'
}
