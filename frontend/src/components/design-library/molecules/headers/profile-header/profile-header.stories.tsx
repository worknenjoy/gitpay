import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Language as WebsiteIcon, GitHub as GitHubIcon } from '@mui/icons-material'
import ProfileHeader from './profile-header'

const meta: Meta<typeof ProfileHeader> = {
  title: 'Design Library/Molecules/Headers/ProfileHeader',
  component: ProfileHeader,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof ProfileHeader>

const baseArgs = {
  profileType: 'contributor' as const,
  username: 'alexandremagno',
  name: 'Alexandre Magno',
  verified: true,
  country: { flagEmoji: '🇧🇷', name: 'Brazil', utcOffset: '−03:00' },
  links: [
    {
      label: 'blog.alexandremagno.net/en',
      href: 'https://blog.alexandremagno.net/en',
      icon: <WebsiteIcon fontSize="small" />
    },
    {
      label: '@alexandremagno',
      href: 'https://github.com/alexandremagno',
      icon: <GitHubIcon fontSize="small" />
    }
  ],
  role: { name: 'contributor', tone: 'orange' as const },
  actions: [
    { key: 'hire', label: 'Hire me →', variant: 'accent' as const },
    { key: 'sponsor', label: 'Sponsor', variant: 'ghost' as const }
  ],
  onAction: action('onAction'),
  identity: ['Joined Mar 2019', '127 issues solved'],
  availability: [{ label: 'Open for job opportunities', active: true }],
  shareUrl: 'https://gitpay.me/alexandremagno'
}

export const Default: Story = {
  args: baseArgs
}

export const Unverified: Story = {
  args: { ...baseArgs, verified: false }
}

export const NoLinks: Story = {
  args: { ...baseArgs, links: [], identity: [], availability: [] }
}
