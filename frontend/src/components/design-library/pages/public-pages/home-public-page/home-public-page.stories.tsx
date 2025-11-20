import React from 'react'
import Home from './home-public-page'
import { withPublicTemplate } from '../../../../../../.storybook/decorators/withPublicTemplate'

export default {
  title: 'Design Library/Pages/Public/Home',
  component: Home,
  decorators: [withPublicTemplate]
}

const Template = (args) => <Home {...args} />

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  user: {
    logged: true,
    data: {
      id: 1,
      email: 'test@gmail.com',
      name: 'Test User',
      Types: [
        {
          id: 1,
          type: 'contributor'
        }
      ]
    },
    error: null
  },
  bottomBarProps: {
    info: {
      tasks: 0,
      bounties: 0,
      users: 0
    },
    getInfo: () => {}
  },
  accountMenuProps: {
    signOut: () => {}
  }
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {
  user: {
    logged: false,
    user: null,
    error: null
  },
  bottomBarProps: {
    info: {
      tasks: 0,
      bounties: 0,
      users: 0
    },
    getInfo: () => {}
  },
  accountMenuProps: {
    signOut: () => {}
  }
}
