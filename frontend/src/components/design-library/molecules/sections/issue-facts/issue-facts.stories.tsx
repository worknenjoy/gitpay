import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import IssueFacts from './issue-facts'

const meta: Meta<typeof IssueFacts> = {
  title: 'Design Library/Molecules/Sections/IssueFacts',
  component: IssueFacts,
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
type Story = StoryObj<typeof IssueFacts>

const deadline = { date: '2026-12-15T00:00:00.000Z', daysLeft: 22, overdue: false }

export const Funded: Story = {
  args: { state: 'funded', visibility: 'public', deadline, onVisibilityChange: () => {} }
}
export const CreatedNoDeadline: Story = {
  args: { state: 'created', visibility: 'public' }
}
export const OwnerSetDeadline: Story = {
  args: {
    state: 'created',
    visibility: 'unlisted',
    onVisibilityChange: () => {},
    onDeadlineClick: () => {}
  }
}
export const Overdue: Story = {
  args: {
    state: 'funded',
    visibility: 'public',
    deadline: { date: '2026-11-20T00:00:00.000Z', daysLeft: -3, overdue: true }
  }
}
export const VisibilityMenuOpen: Story = {
  args: { ...Funded.args, defaultVisibilityOpen: true }
}
export const Loading: Story = { args: { ...Funded.args, completed: false } }
