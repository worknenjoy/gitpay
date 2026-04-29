import React from 'react'
import ProjectListCompact from './project-list-compact'

const projects = [
  {
    id: 1,
    name: 'gitpay',
    description: 'Payment platform for open-source work delivered.',
    languages: ['TypeScript', 'React', 'Node'],
    Organization: { id: 1, name: 'worknenjoy', provider: 'github' },
    Tasks: [
      { status: 'open' },
      { status: 'open' },
      { status: 'open' },
      { status: 'open' },
      { status: 'open' },
      { status: 'open' },
      { status: 'open' },
      { status: 'open' },
      { status: 'closed', value: 1200 },
      { status: 'closed', value: 800 }
    ]
  },
  {
    id: 2,
    name: 'api-service',
    description: 'REST API service for managing bounties and contributions.',
    languages: ['TypeScript', 'Node'],
    Organization: { id: 1, name: 'worknenjoy', provider: 'github' },
    Tasks: [
      { status: 'open' },
      { status: 'open' },
      { status: 'closed', value: 300 }
    ]
  },
  {
    id: 3,
    name: 'design-system',
    description: 'Component library and design tokens for Gitpay products.',
    languages: ['React', 'CSS'],
    Organization: { id: 2, name: 'opensource-org', provider: 'github' },
    Tasks: [
      { status: 'open', value: 80 },
      { status: 'open', value: 20 },
      { status: 'closed', value: 200 }
    ]
  }
]

export default {
  title: 'Design Library/Molecules/Lists/Projects/ProjectListCompact',
  component: ProjectListCompact
}

const ListTemplate = (args) => <ProjectListCompact {...args} />

export const ProjectListCompactStory = ListTemplate.bind({})
ProjectListCompactStory.storyName = 'Default'
ProjectListCompactStory.args = {
  projects: { completed: true, data: projects }
}

export const LoadingState = ListTemplate.bind({})
LoadingState.storyName = 'Loading'
LoadingState.args = {
  projects: { completed: false, data: [] }
}
