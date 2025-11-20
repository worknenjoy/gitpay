import React from 'react'
import BankAccountTabs from './bank-account-tabs'

export default {
  title: 'Design Library/Molecules/Tabs/BankAccountTabs',
  component: BankAccountTabs,
}

const Template = (args) => <BankAccountTabs {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here if needed
}
