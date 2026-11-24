import type { Meta, StoryObj } from '@storybook/react'
import EmptyBounty from './empty-bounty'

const meta: Meta<typeof EmptyBounty> = {
  title: 'Design Library/Molecules/Empty/EmptyBounty',
  component: EmptyBounty
}

export default meta
type Story = StoryObj<typeof EmptyBounty>

export const Default: Story = { args: {} }
export const WithAction: Story = { args: { onActionClick: () => {} } }
