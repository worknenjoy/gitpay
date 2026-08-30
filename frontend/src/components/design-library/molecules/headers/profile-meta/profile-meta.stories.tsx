import type { Meta, StoryObj } from '@storybook/react'
import ProfileMeta from './profile-meta'

const meta: Meta<typeof ProfileMeta> = {
  title: 'Design Library/Molecules/Headers/ProfileMeta',
  component: ProfileMeta,
  parameters: { layout: 'centered' }
}
export default meta

type Story = StoryObj<typeof ProfileMeta>

export const Contributor: Story = {
  args: {
    identity: ['Joined Mar 2019', '127 issues solved'],
    availability: [{ label: 'Open for job opportunities', dot: true }]
  }
}

export const Maintainer: Story = {
  args: {
    identity: ['Maintaining since 2019', '4 active projects'],
    availability: [
      { label: 'Active this week', dot: true },
      { label: 'Accepting sponsors', dot: true }
    ],
    context: ['215 contributors across repos', '$17,020 paid out']
  }
}

export const Provider: Story = {
  args: {
    identity: ['Provider since 2021', '147 jobs delivered'],
    availability: [
      { label: 'Available now', dot: true },
      { label: 'Avg. delivery 3 days', dot: true },
      { label: 'Stripe-verified escrow', dot: true }
    ],
    context: ['★ 4.96 / 5 across 132 reviews', '62% repeat clients']
  }
}

export const NeedsAttention: Story = {
  args: {
    identity: ['Joined Mar 2019'],
    availability: [{ label: 'Verification required', dot: true, warn: true }]
  }
}
