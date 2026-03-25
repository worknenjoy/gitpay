import React from 'react'
import { Box } from '@mui/material'
import ProjectCardCompact from 'design-library/molecules/cards/project-card/project-card-compact'
import ProjectListCompact from './project-list-compact'

const projects = [
  {
    id: 1,
    name: 'Project 1',
    description: 'Description 1',
    Organization: { id: 1, name: 'Org 1', provider: 'github' },
    Tasks: [{ status: 'open', value: 50 }, { status: 'closed' }, { status: 'open' }]
  },
  {
    id: 2,
    name: 'Project 2',
    description: 'Description 2',
    Organization: { id: 2, name: 'Org 2', provider: 'bitbucket' },
    Tasks: [{ status: 'open' }, { status: 'closed' }]
  },
  {
    id: 3,
    name: 'Project 3',
    description: 'Description 3',
    Organization: { id: 3, name: 'Org 3', provider: 'github' },
    Tasks: [
      { status: 'open', value: 20 },
      { status: 'open', value: 80 }
    ]
  }
]

export default {
  title: 'Design Library/Molecules/Lists/Projects/ProjectListCompact',
  component: ProjectListCompact
}

const ListTemplate = (args) => <ProjectListCompact {...args} />

export const ProjectListCompactStory = ListTemplate.bind({})
ProjectListCompactStory.storyName = 'List (large, default)'
ProjectListCompactStory.args = {
  projects: { completed: true, data: projects }
}

export const LoadingState = ListTemplate.bind({})
LoadingState.args = {
  projects: { completed: false, data: [] }
}

export const ChipSmall = () => (
  <Box display="flex" flexWrap="wrap" gap={1}>
    {projects.map((p) => (
      <ProjectCardCompact key={p.id} project={p} size="small" />
    ))}
  </Box>
)
ChipSmall.storyName = 'Chip — small'

export const ChipLarge = () => (
  <Box display="flex" flexWrap="wrap" gap={1}>
    {projects.map((p) => (
      <ProjectCardCompact key={p.id} project={p} size="large" />
    ))}
  </Box>
)
ChipLarge.storyName = 'Chip — large'
