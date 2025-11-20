import React from 'react'
import Topbar from './topbar-layout'

export default {
  title: 'Design Library/Organisms/Layouts/Topbar/Topbar',
  component: Topbar
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
