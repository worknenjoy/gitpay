import React from 'react'
import { Box, Grid } from '@mui/material'
import ProjectCard from './project-card'

export default {
  title: 'Design Library/Molecules/Cards/ProjectCard',
  component: ProjectCard
}

const Template = (args) => (
  <Box maxWidth={380}>
    <ProjectCard {...args} />
  </Box>
)

export const DefaultProjectCard = Template.bind({})
DefaultProjectCard.args = {
  completed: true,
  project: {
    id: 1,
    name: 'gitpay',
    description: 'Payment platform for open-source work delivered.',
    languages: ['TypeScript', 'React', 'Node'],
    Organization: {
      id: 1,
      name: 'worknenjoy',
      provider: 'github'
    },
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
      { status: 'closed', value: 800 },
      { status: 'closed', value: 500 }
    ]
  }
}

export const WithWebsite = Template.bind({})
WithWebsite.args = {
  completed: true,
  project: {
    id: 2,
    name: 'api-service',
    description: 'An open-source REST API service for managing bounties and contributions.',
    websiteUrl: 'https://gitpay.me',
    languages: ['TypeScript', 'Node'],
    Organization: {
      id: 1,
      name: 'worknenjoy',
      provider: 'github'
    },
    Tasks: [
      { status: 'open' },
      { status: 'open' },
      { status: 'open' },
      { status: 'closed', value: 300 },
      { status: 'closed', value: 150 }
    ]
  }
}

export const NoLanguages = Template.bind({})
NoLanguages.args = {
  completed: true,
  project: {
    id: 3,
    name: 'design-system',
    description: 'Component library and design tokens for Gitpay products.',
    Organization: {
      id: 1,
      name: 'worknenjoy',
      provider: 'github'
    },
    Tasks: [
      { status: 'open' },
      { status: 'open' },
      { status: 'closed', value: 200 }
    ]
  }
}

export const NoPaidOut = Template.bind({})
NoPaidOut.args = {
  completed: true,
  project: {
    id: 4,
    name: 'new-project',
    description: 'A brand new project with no completed bounties yet.',
    languages: ['Python', 'Go'],
    Organization: {
      id: 2,
      name: 'opensource-org',
      provider: 'github'
    },
    Tasks: [
      { status: 'open' },
      { status: 'open' },
      { status: 'open' }
    ]
  }
}

export const BitbucketProject = Template.bind({})
BitbucketProject.args = {
  completed: true,
  project: {
    id: 5,
    name: 'bb-project',
    description: 'A project hosted on Bitbucket.',
    languages: ['Java'],
    Organization: {
      id: 3,
      name: 'bitbucket-org',
      provider: 'bitbucket'
    },
    Tasks: [{ status: 'open' }, { status: 'closed', value: 500 }]
  }
}

export const GridOfCards = () => (
  <Grid container spacing={2}>
    {[DefaultProjectCard.args, WithWebsite.args, NoLanguages.args, NoPaidOut.args].map((args, i) => (
      <Grid key={i} size={{ lg: 4, md: 6, xs: 12 }}>
        <ProjectCard {...args} />
      </Grid>
    ))}
  </Grid>
)
GridOfCards.storyName = 'Grid of Cards'

export const LoadingProjectCard = Template.bind({})
LoadingProjectCard.args = {
  completed: false,
  project: {}
}
