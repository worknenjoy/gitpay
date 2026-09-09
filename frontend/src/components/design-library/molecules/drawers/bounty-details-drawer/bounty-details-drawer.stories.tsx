import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import BountyDetailsDrawer from './bounty-details-drawer'

const meta: Meta<typeof BountyDetailsDrawer> = {
  title: 'Design Library/Molecules/Drawers/BountyDetailsDrawer',
  component: BountyDetailsDrawer,
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta
type Story = StoryObj<typeof BountyDetailsDrawer>

const sampleBounty = {
  id: 1101,
  title: 'When accept the terms in account settings, redirect fails',
  status: 'closed',
  value: 50,
  provider: 'github',
  url: 'https://github.com/gitpay/gitpay/issues/1101',
  createdAt: '2024-11-02T10:00:00Z',
  description:
    'Investigate the reported behavior, reproduce locally with the steps in the comments, and submit a PR with tests covering the edge cases. Bounty is paid out via Stripe upon merge.',
  author: { name: 'Maria Rodriguez' },
  Labels: [
    { id: 'bug', name: 'bug' },
    { id: 'good-first-issue', name: 'good first issue' }
  ],
  Project: {
    id: 1,
    OrganizationId: 1,
    name: 'gitpay',
    ProgrammingLanguages: [
      { id: 'ts', name: 'TypeScript' },
      { id: 'mdx', name: 'MDX' }
    ]
  },
  histories: [
    { id: 1, type: 'create', createdAt: '2024-11-02T10:00:00Z' },
    {
      id: 2,
      type: 'update',
      fields: ['value'],
      oldValues: ['0'],
      newValues: ['50'],
      createdAt: '2024-11-04T09:00:00Z'
    }
  ]
}

export const Default: Story = {
  args: {
    open: true,
    onClose: action('onClose'),
    bounty: sampleBounty,
    completed: true
  }
}

export const Closed: Story = {
  args: {
    open: false,
    onClose: action('onClose'),
    bounty: sampleBounty,
    completed: true
  }
}
