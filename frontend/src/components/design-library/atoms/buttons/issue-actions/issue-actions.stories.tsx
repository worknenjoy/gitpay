import React from 'react'
import IssueActions from './issue-actions'

const roles = {
  admin: {
    primary: [
      {
        onClick: () => {},
        label: 'Pay contributor',
        disabled: false,
        icon: null
      }
    ],
    secondary: [
      {
        onClick: () => {},
        label: 'Make a payment',
        disabled: false,
        icon: null
      }
    ]
  },
  user: {
    primary: [
      {
        onClick: () => {},
        label: 'Create',
        disabled: false,
        icon: null
      }
    ],
    secondary: [
      {
        onClick: () => {},
        label: 'Cancel',
        disabled: false,
        icon: null
      }
    ]
  }
}

export default {
  title: 'Design Library/Atoms/Buttons/IssueActions',
  component: IssueActions
}

const Template = (args) => <IssueActions {...args} />

export const Default = Template.bind({})
Default.args = {
  role: 'admin',
  roles
}

export const User = Template.bind({})
User.args = {
  role: 'user',
  roles
}
