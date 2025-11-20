import React from 'react'
import AccountTabs from './account-tabs'

export default {
  title: 'Design Library/Molecules/Tabs/AccountTabs',
  component: AccountTabs,
}

const Template = (args) => <AccountTabs {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    completed: true,
    data: {
      id: '1',
      name: 'John Doe',
      Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }],
    },
  },
  children: <div>Account Tabs Content</div>,
}
