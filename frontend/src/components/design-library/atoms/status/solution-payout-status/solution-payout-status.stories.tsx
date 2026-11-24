import type { Meta, StoryObj } from '@storybook/react'
import SolutionPayoutStatus from './solution-payout-status'

const meta: Meta<typeof SolutionPayoutStatus> = {
  title: 'Design Library/Atoms/Status/SolutionPayoutStatus',
  component: SolutionPayoutStatus,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof SolutionPayoutStatus>

export const Ready: Story = { args: { status: 'ready' } }
export const Waiting: Story = { args: { status: 'waiting' } }
export const NotEligible: Story = { args: { status: 'none' } }
export const Loading: Story = { args: { status: 'ready', completed: false } }
