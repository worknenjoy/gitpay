import React from 'react'
import ProfileSidebar from './profile-sidebar-layout'

export default {
  title: 'Design Library/Organisms/Layouts/ProfileSidebar/ProfileSidebar',
  component: ProfileSidebar
}

const Template = (args) => <ProfileSidebar {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    completed: true,
    data: {
      id: 1,
      provider: 'github',
      title: 'Sample Issue',
      metadata: {
        issue: {
          user: {
            login: 'octocat',
            avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
          }
        }
      },
      Types: [
        {
          id: 1,
          name: 'contributor'
        },
        {
          id: 2,
          name: 'maintainer'
        },
        {
          id: 3,
          name: 'funding'
        }
      ]
    }
  }
}

export const Loading = Template.bind({})
Loading.args = {
  user: {
    completed: false,
    data: {}
  }
}
