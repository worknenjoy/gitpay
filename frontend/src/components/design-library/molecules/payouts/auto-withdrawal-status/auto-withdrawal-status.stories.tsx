import type { Meta, StoryObj } from '@storybook/react'
import AutoWithdrawalStatus from './auto-withdrawal-status'

const meta: Meta<typeof AutoWithdrawalStatus> = {
  title: 'Design Library/Molecules/Payouts/AutoWithdrawalStatus',
  component: AutoWithdrawalStatus,
  parameters: {
    layout: 'centered'
  },
  args: {
    onChange: () => {}
  }
}

export default meta
type Story = StoryObj<typeof AutoWithdrawalStatus>

export const NotConnected: Story = {
  args: { connected: false, enabled: false }
}

export const Disabled: Story = {
  args: { enabled: false }
}

export const Weekly: Story = {
  args: { enabled: true, frequency: 'weekly' }
}

export const Daily: Story = {
  args: { enabled: true, frequency: 'daily' }
}

export const MonthlyWithNextRun: Story = {
  args: { enabled: true, frequency: 'monthly', nextRunDate: '2026-12-01' }
}

export const Loading: Story = {
  args: { enabled: false, completed: false }
}

export const ReadOnly: Story = {
  args: { enabled: true, frequency: 'weekly', onChange: undefined }
}
