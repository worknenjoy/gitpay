import React from 'react'
import PrivateBase from './private-base'
import { Typography } from '@mui/material'

export default {
  title: 'Design Library/Templates/Base/PrivateBase',
  component: PrivateBase
}

const Template = (args) => <PrivateBase {...args} />

export const Default = Template.bind({})
Default.args = {
  children: <Typography variant="body1">Private Base content</Typography>,
  createTask: () => console.log('Create Task'),
  signOut: () => console.log('Sign Out'),
  user: {
    data: {
      id: '1',
      name: 'John Doe',
      email_verified: true,
      Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }]
    },
    completed: true
  },
  profileHeaderProps: {
    title: 'Profile Header',
    subtitle: 'Subtitle'
  },
  bottomProps: {
    info: { bounties: 0, users: 0, tasks: 0 },
    getInfo: () => {}
  }
}

export const Loading = Template.bind({})
Loading.args = {
  children: <Typography variant="body1">Loading...</Typography>,
  createTask: () => console.log('Create Task'),
  signOut: () => console.log('Sign Out'),
  user: {
    data: {},
    completed: false
  },
  profileHeaderProps: {
    title: 'Loading...',
    subtitle: 'Loading...'
  },
  bottomProps: {
    info: { bounties: 0, users: 0, tasks: 0 },
    getInfo: () => {}
  }
}
