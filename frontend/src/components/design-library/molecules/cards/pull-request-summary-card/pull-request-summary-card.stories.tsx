import type { Meta, StoryObj } from '@storybook/react'
import PullRequestSummaryCard from './pull-request-summary-card'

const meta: Meta<typeof PullRequestSummaryCard> = {
  title: 'Design Library/Molecules/Cards/PullRequestSummaryCard',
  component: PullRequestSummaryCard,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof PullRequestSummaryCard>

const base = {
  repo: 'worknenjoy/gitpay',
  number: 1301,
  title: 'Add Whop payout provider to the payout settings screen'
}

export const Open: Story = { args: { ...base, state: 'open' } }
export const Closed: Story = { args: { ...base, state: 'closed' } }
export const Merged: Story = { args: { ...base, state: 'merged' } }
export const Loading: Story = { args: { ...base, state: 'open', completed: false } }
