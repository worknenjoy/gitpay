import type { Meta, StoryObj } from '@storybook/react'
import ProfileUserHeader from './profile-user-header'

const meta: Meta<typeof ProfileUserHeader> = {
  title: 'Design Library/Molecules/Headers/ProfileUserHeader',
  component: ProfileUserHeader,
  args: {
    profile: {
      picture_url: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
      username: 'octocat',
      name: 'The Octocat',
      profile_url: 'https://github.com/octocat'
    }
  },
  parameters: {
    layout: 'centered'
  }
}
export default meta

type Story = StoryObj<typeof ProfileUserHeader>

export const Basic: Story = {}

export const WithLongName: Story = {
  args: {
    profile: {
      picture_url: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
      username: 'octocat',
      name: 'The Octocat with a Very Long Name to Test Overflow',
      profile_url: 'https://github.com/octocat'
    }
  }
}

export const WithoutAvatar: Story = {
  args: {
    profile: {
      picture_url: '',
      username: 'octocat',
      name: 'The Octocat',
      profile_url: 'https://github.com/octocat'
    }
  }
}

export const Contributor: Story = {
  args: {
    roles: [{ name: 'contributor', tone: 'orange', active: true }],
    cta: [
      { label: 'Hire me →', variant: 'contained', color: 'secondary' },
      { label: 'Sponsor', variant: 'outlined' }
    ],
    meta: {
      identity: ['Joined Mar 2019', '127 issues solved'],
      availability: [{ label: 'Open for job opportunities', dot: true }]
    }
  }
}

export const Maintainer: Story = {
  args: {
    roles: [{ name: 'maintainer', tone: 'teal', active: true }],
    cta: [
      { label: 'Sponsor projects →', variant: 'contained', color: 'secondary' },
      { label: 'View bounties', variant: 'outlined' }
    ],
    meta: {
      identity: ['Maintaining since 2019', '4 active projects'],
      availability: [
        { label: 'Active this week', dot: true },
        { label: 'Accepting sponsors', dot: true }
      ],
      context: ['215 contributors across repos', '$17,020 paid out']
    }
  }
}

export const ServiceProvider: Story = {
  args: {
    roles: [{ name: 'service provider', tone: 'yellow', active: true }],
    cta: [
      { label: 'Pay now →', variant: 'contained', color: 'secondary' },
      { label: 'Request a quote', variant: 'outlined' }
    ],
    meta: {
      identity: ['Provider since 2021', '147 jobs delivered'],
      availability: [
        { label: 'Available now', dot: true },
        { label: 'Stripe-verified escrow', dot: true }
      ],
      context: ['62% repeat clients']
    }
  }
}

export const Combined: Story = {
  args: {
    roles: [
      { name: 'contributor', tone: 'orange', active: true },
      { name: 'maintainer', tone: 'teal', active: true },
      { name: 'provider', tone: 'yellow', active: true },
      { name: 'funding', tone: 'pink', active: true }
    ],
    cta: [
      { label: 'Hire me →', variant: 'contained', color: 'secondary' },
      { label: 'Sponsor', variant: 'outlined' }
    ],
    meta: {
      identity: ['Joined Mar 2019', 'All roles enabled'],
      availability: [{ label: 'Available for work', dot: true }],
      context: ['$45,260 lifetime earned']
    }
  }
}
