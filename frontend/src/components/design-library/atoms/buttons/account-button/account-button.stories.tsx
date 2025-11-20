import React from 'react'
import AccountButton from './account-button'

export default {
  title: 'Design Library/Atoms/Buttons/AccountButton',
  component: AccountButton
}

const Template = (args) => <AccountButton {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  handleMenu: () => console.log('handleMenu'),
  user: {
    logged: true,
    completed: true,
    error: null,
    data: {
      email: 'test@gmail.com',
      username: 'Test User',
      picture_url: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'
    }
  }
}
