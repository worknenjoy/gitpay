import type { Meta, StoryObj } from '@storybook/react'
import BountyPaymentStatus from './bounty-payment-status'

const meta: Meta<typeof BountyPaymentStatus> = {
  title: 'Design Library/Atoms/Status/PaymentTypesStatus/BountyPaymentStatus',
  component: BountyPaymentStatus,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof BountyPaymentStatus>

export const Paid: Story = { args: { status: 'paid' } }
export const Pledged: Story = { args: { status: 'pledged' } }
export const Pending: Story = { args: { status: 'pending' } }
export const Loading: Story = { args: { status: 'paid', completed: false } }
