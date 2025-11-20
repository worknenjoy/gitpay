import React from 'react'
import AccountSettings from './account-settings'

export default {
  title: 'Design Library/Molecules/TriggerButtons/AccountSettings',
  component: AccountSettings
}

const Template = (args) => <AccountSettings {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  user: {
    logged: true,
    completed: true,
    error: null,
    data: {
      id: 1,
      email: 'test@gmail.com',
      username: 'Test User',
      picture_url: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
      Types: [
        {
          id: 1,
          name: 'contributor'
        },
        {
          id: 2,
          name: 'maintainer'
        }
      ]
    }
  }
}
