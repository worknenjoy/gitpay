import React from 'react'
import UserProfileTypeCards from './user-profile-type-cards'

export default {
  title: 'Design Library/Atoms/Inputs/Fields/UserProfileTypeCards',
  component: UserProfileTypeCards
}

const profileTypes = {
  completed: true,
  data: [
    {
      id: '1',
      name: 'funding',
      label: 'Funding',
      description: 'You will mostly fund issues'
    },
    {
      id: '2',
      name: 'contributor',
      label: 'Contributor',
      description: 'You will solve issues'
    },
    {
      id: '3',
      name: 'maintainer',
      label: 'Maintainer',
      description: 'You have a project'
    },
    {
      id: '4',
      name: 'provider',
      label: 'Provider',
      description: 'You provide a service and need to request payments'
    }
  ]
}

const Template = (args) => <UserProfileTypeCards {...args} />

export const Default = Template.bind({})
Default.args = {
  profileTypes
}

export const Compact = Template.bind({})
Compact.args = {
  profileTypes,
  compact: true,
  itemSize: { xs: 12, sm: 6, md: 6 }
}

export const Loading = Template.bind({})
Loading.args = {
  profileTypes: { completed: false, data: [] }
}

export const NoSelectAll = Template.bind({})
NoSelectAll.args = {
  profileTypes,
  includeSelectAll: false
}
