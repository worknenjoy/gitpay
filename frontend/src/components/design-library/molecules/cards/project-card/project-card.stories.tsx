import React from 'react'
import ProjectCard from './project-card'

export default {
  title: 'Design Library/Molecules/Cards/ProjectCard',
  component: ProjectCard
}

const Template = (args) => <ProjectCard {...args} />

export const DefaultProjectCard = Template.bind({})
DefaultProjectCard.args = {
  completed: true,
  project: {
    id: 1,
    name: 'Project 1',
    description:
      'An open-source project to help developers manage bounties and get paid for their contributions.',
    status: 'Open',
    Organization: {
      id: 1,
      name: 'Organization 1',
      description: 'Description 1',
      provider: 'GitHub'
    },
    Tasks: [{ status: 'open' }, { status: 'closed' }, { status: 'open' }]
  }
}

export const WithWebsite = Template.bind({})
WithWebsite.args = {
  completed: true,
  project: {
    id: 1,
    name: 'Project 1',
    description:
      'An open-source project to help developers manage bounties and get paid for their contributions.',
    websiteUrl: 'https://gitpay.me',
    status: 'Open',
    Organization: {
      id: 1,
      name: 'Organization 1',
      description: 'Description 1',
      provider: 'GitHub'
    },
    Tasks: [{ status: 'open', value: 50 }, { status: 'closed' }, { status: 'open' }]
  }
}

export const BountyProjectCard = Template.bind({})
BountyProjectCard.args = {
  completed: true,
  project: {
    id: 1,
    name: 'Project 1',
    description: 'Description 1',
    status: 'Open',
    Organization: {
      id: 1,
      name: 'Organization 1',
      description: 'Description 1',
      provider: 'GitHub'
    },
    Tasks: [{ status: 'open', value: 50 }, { status: 'closed' }, { status: 'open' }]
  }
}

export const LoadingProjectCard = Template.bind({})
LoadingProjectCard.args = {
  completed: false,
  project: {}
}
