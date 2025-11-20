import React from 'react'
import OrganizationCard from './organization-card'

export default {
  title: 'Design Library/Molecules/Cards/OrganizationCard',
  component: OrganizationCard,
}

const Template = (args) => <OrganizationCard {...args} />

export const Default = Template.bind({})
Default.args = {
  completed: true,
  organization: {
    id: 1,
    name: 'Organization 1',
    User: {
      id: 1,
      name: 'User 1',
      username: 'user1',
    },
    Projects: [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' },
      { id: 3, name: 'Project 3' },
    ],
  },
}

export const Loading = Template.bind({})
Loading.args = {
  organization: {},
  completed: false,
}
