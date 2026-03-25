import React from 'react'
import { Box } from '@mui/material'
import OrganizationCardCompact from 'design-library/molecules/cards/organization-card/organization-card-compact'
import OrganizationListCompact from './organization-list-compact'

const organizations = [
  {
    id: 1,
    name: 'Organization 1',
    description: 'Description 1',
    provider: 'github',
    User: { id: 1, name: 'User 1' },
    Projects: [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' }
    ]
  },
  {
    id: 2,
    name: 'Organization 2',
    description: 'Description 2',
    provider: 'bitbucket',
    User: { id: 2, name: 'User 2' },
    Projects: [{ id: 3, name: 'Project 3' }]
  },
  {
    id: 3,
    name: 'Organization 3',
    description: 'Description 3',
    provider: 'github',
    User: { id: 3, name: 'User 3' },
    Projects: []
  }
]

export default {
  title: 'Design Library/Molecules/Lists/Organizations/OrganizationListCompact',
  component: OrganizationListCompact
}

const ListTemplate = (args) => <OrganizationListCompact {...args} />

export const OrganizationListCompactStory = ListTemplate.bind({})
OrganizationListCompactStory.storyName = 'List (large, default)'
OrganizationListCompactStory.args = {
  organizations: { completed: true, data: organizations }
}

export const Loading = ListTemplate.bind({})
Loading.args = {
  organizations: { completed: false, data: [] }
}

export const ChipSmall = () => (
  <Box display="flex" flexWrap="wrap" gap={1}>
    {organizations.map((o) => (
      <OrganizationCardCompact key={o.id} organization={o} size="small" />
    ))}
  </Box>
)
ChipSmall.storyName = 'Chip — small'

export const ChipLarge = () => (
  <Box display="flex" flexWrap="wrap" gap={1}>
    {organizations.map((o) => (
      <OrganizationCardCompact key={o.id} organization={o} size="large" />
    ))}
  </Box>
)
ChipLarge.storyName = 'Chip — large'
