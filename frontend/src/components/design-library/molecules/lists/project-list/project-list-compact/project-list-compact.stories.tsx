import React from 'react'
import ProjectListCompact from './project-list-compact'

export default {
  title: 'Design Library/Molecules/Lists/Projects/ProjectListCompact',
  component: ProjectListCompact,
}

const Template = (args) => <ProjectListCompact {...args} />

export const ProjectListCompactStory = Template.bind({})
ProjectListCompactStory.args = {
  projects: {
    completed: true,
    data: [
      {
        id: 1,
        name: 'Project 1',
        description: 'Description 1',
        Organization: { name: 'Org 1', provider: 'GitHub' },
        Tasks: [{ status: 'open', value: 50 }, { status: 'closed' }, { status: 'open' }],
      },
      {
        id: 2,
        name: 'Project 2',
        description: 'Description 2',
        Organization: { name: 'Org 2', provider: 'Bitbucket' },
        Tasks: [{ status: 'open' }, { status: 'closed' }],
      },
      {
        id: 3,
        name: 'Project 3',
        description: 'Description 3',
        Organization: { name: 'Org 3', provider: 'GitLab' },
        Tasks: [
          { status: 'open', value: 20 },
          { status: 'open', value: 80 },
        ],
      },
    ],
  },
}

export const LoadingState = Template.bind({})
LoadingState.args = {
  projects: {
    completed: false,
    data: [],
  },
}
