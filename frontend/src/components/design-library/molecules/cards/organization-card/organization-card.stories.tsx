import React from 'react'
import OrganizationCard from './organization-card'

export default {
  title: 'Design Library/Molecules/Cards/OrganizationCard',
  component: OrganizationCard
}

const Template = (args) => <OrganizationCard {...args} />

export const Default = Template.bind({})
Default.args = {
  completed: true,
  organization: {
    id: 1,
    name: 'Organization 1',
    description:
      'An open-source organization building tools for developers to manage bounties and get paid for their contributions.',
    provider: 'github',
    User: { id: 1, name: 'User 1', username: 'user1' },
    Projects: [
      {
        id: 1,
        name: 'Project 1',
        Tasks: [{ status: 'open', value: 50 }, { status: 'open' }, { status: 'closed' }]
      },
      { id: 2, name: 'Project 2', Tasks: [{ status: 'open', value: 100 }, { status: 'closed' }] },
      { id: 3, name: 'Project 3', Tasks: [{ status: 'closed' }, { status: 'closed' }] }
    ]
  }
}

export const NoOpenIssues = Template.bind({})
NoOpenIssues.args = {
  completed: true,
  organization: {
    id: 2,
    name: 'Organization 2',
    description: 'All issues resolved — a well-maintained project.',
    provider: 'github',
    User: { id: 2, name: 'User 2', username: 'user2' },
    Projects: [
      { id: 4, name: 'Project 4', Tasks: [{ status: 'closed' }, { status: 'closed' }] },
      { id: 5, name: 'Project 5', Tasks: [{ status: 'closed' }] }
    ]
  }
}

export const WithWebsite = Template.bind({})
WithWebsite.args = {
  completed: true,
  organization: {
    id: 3,
    name: 'Organization 3',
    description:
      'An open-source organization building tools for developers to manage bounties and get paid for their contributions.',
    provider: 'github',
    websiteUrl: 'https://gitpay.me',
    User: { id: 3, name: 'User 3', username: 'user3' },
    Projects: [
      { id: 6, name: 'Project 6', Tasks: [{ status: 'open', value: 75 }] },
      { id: 7, name: 'Project 7', Tasks: [{ status: 'open' }, { status: 'closed' }] }
    ]
  }
}

export const Loading = Template.bind({})
Loading.args = {
  organization: {},
  completed: false
}
