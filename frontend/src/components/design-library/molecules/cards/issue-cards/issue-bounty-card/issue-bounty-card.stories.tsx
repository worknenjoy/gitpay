import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import IssueBountyCard from './issue-bounty-card'

const meta: Meta<typeof IssueBountyCard> = {
  title: 'Design Library/Molecules/Cards/IssueCards/IssueBountyCard',
  component: IssueBountyCard,
  parameters: { layout: 'padded' },
  args: { onAdd: () => {}, onBreakdown: () => {} },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof IssueBountyCard>

const sponsors = [
  { name: 'worknenjoy' },
  { name: 'defnax' },
  { name: 'Anonymous', anonymous: true }
]

export const PaidInAdvance: Story = {
  args: { total: 350, sponsors, timing: 'advance' }
}

export const PayLater: Story = {
  args: { total: 300, sponsors: [{ name: 'RetroShare' }], timing: 'later' }
}

export const Flexible: Story = {
  args: { total: 350, pledged: 150, sponsors, timing: 'flex', allowLater: true }
}

export const NoBounty: Story = {
  args: { total: 0, sponsors: [] }
}

export const NoBountyWithPayLater: Story = {
  args: { total: 0, sponsors: [], timing: 'flex', allowLater: true }
}

export const PaidOut: Story = {
  args: { total: 350, sponsors, disabled: true }
}

export const Loading: Story = {
  args: { total: 0, completed: false }
}
