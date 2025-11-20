import React from 'react'
import ProfileAccountMenu from './profile-account-menu'

export default {
  title: 'Design Library/Molecules/Menus/ProfileAccountMenu',
  component: ProfileAccountMenu,
  argTypes: {
    onLogout: { action: 'logout' },
    onProfileClick: { action: 'profileClick' },
  },
}

const Template = (args) => <ProfileAccountMenu {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    id: 1,
    username: 'Test User',
    Types: [
      {
        id: 1,
        name: 'contributor',
      },
      {
        id: 2,
        name: 'maintainer',
      },
      {
        id: 3,
        name: 'funding',
      },
    ],
  },
}
