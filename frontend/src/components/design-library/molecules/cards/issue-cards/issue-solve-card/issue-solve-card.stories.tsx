import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import IssueSolveCard from './issue-solve-card'

const meta: Meta<typeof IssueSolveCard> = {
  title: 'Design Library/Molecules/Cards/IssueCards/IssueSolveCard',
  component: IssueSolveCard,
  parameters: { layout: 'padded' },
  args: { onSend: () => {}, onSolutions: () => {} },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof IssueSolveCard>

export const Funded: Story = { args: { bountyTotal: 350, solutionsCount: 2 } }
export const PayLater: Story = { args: { bountyTotal: 300, payLater: true, solutionsCount: 1 } }
export const NoBounty: Story = { args: { bountyTotal: 0 } }
export const WithLevel: Story = { args: { bountyTotal: 350, level: 'Intermediate' } }
export const PaidOut: Story = { args: { bountyTotal: 350, disabled: true } }
export const Loading: Story = { args: { bountyTotal: 0, completed: false } }
