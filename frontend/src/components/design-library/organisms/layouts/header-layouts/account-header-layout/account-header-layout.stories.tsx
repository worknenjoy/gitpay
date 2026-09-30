import React from 'react'
import AccountHeader from './account-header-layout'
import { withReduxStore } from '../../../../../../../.storybook/decorators/withReduxStore'

export default {
  title: 'Design Library/Organisms/Layouts/Header/AccountHeader',
  component: AccountHeader,
  // Renders the Redux-connected ImportPullRequest container directly.
  decorators: [withReduxStore]
}

const Template = (args) => <AccountHeader {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    id: 1,
    username: 'Test User',
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
