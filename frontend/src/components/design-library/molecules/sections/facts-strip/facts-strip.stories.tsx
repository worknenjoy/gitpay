import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import StatusChip from 'design-library/atoms/status/status-chip/status-chip'
import FactsStrip from './facts-strip'

const meta: Meta<typeof FactsStrip> = {
  title: 'Design Library/Molecules/Sections/FactsStrip',
  component: FactsStrip,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof FactsStrip>

export const ThreeFacts: Story = {
  args: {
    facts: [
      {
        label: 'State',
        help: 'Where the issue is on Gitpay.',
        value: <StatusChip label="Funded" tone="success" />
      },
      { label: 'Visibility', help: 'Who can find it.', value: 'Public' },
      { label: 'Deadline', help: 'When a solution is needed.', value: 'Dec 15, 2026', sub: '22 days left' }
    ]
  }
}

export const TwoFacts: Story = {
  args: {
    facts: [
      { label: 'State', value: <StatusChip label="Created" tone="neutral" /> },
      { label: 'Visibility', value: 'Not listed' }
    ]
  }
}

export const Loading: Story = {
  args: { ...ThreeFacts.args, completed: false }
}
