import React from 'react'
import Topbar from './topbar-layout'
import { withReduxStore } from '../../../../../../../.storybook/decorators/withReduxStore'

export default {
  title: 'Design Library/Organisms/Layouts/Topbar/Topbar',
  component: Topbar,
  // LoggedIn renders the Redux-connected ImportPullRequest container (via Topbar itself).
  decorators: [withReduxStore]
}

const Template = (args: any) => <Topbar {...args} />

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  user: {
    logged: true,
    completed: true,
    data: {
      id: 1,
      email: 'test@gmail.com',
      username: 'test',
      Types: [
        {
          id: 1,
          name: 'maintainer'
        }
      ]
    }
  }
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {
  // Add default props here
  user: {}
}
