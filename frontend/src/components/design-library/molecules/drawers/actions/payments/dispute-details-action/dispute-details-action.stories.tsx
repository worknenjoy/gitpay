import type { Meta, StoryObj } from '@storybook/react'
import DisputeDetailsAction from './dispute-details-action'

const meta: Meta<typeof DisputeDetailsAction> = {
  title: 'Design Library/Molecules/Drawers/Actions/Payments/DisputeDetailsAction',
  component: DisputeDetailsAction,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof DisputeDetailsAction>

export const Dispute: Story = {
  args: {
    open: true,
    onClose: () => {},
    transaction: {
      id: 1,
      reason: 'DISPUTE',
      reason_details: 'Customer claims the product was not as described',
      type: 'DEBIT',
      status: 'won',
      amount: 5000,
      currency: 'usd',
      sourceId: 'dp_1AbCdEfGhIjKlMn',
      openedAt: '2026-08-01T10:00:00.000Z',
      closedAt: '2026-08-10T10:00:00.000Z',
      createdAt: '2026-08-01T10:00:00.000Z'
    }
  }
}

export const RefundFee: Story = {
  args: {
    open: true,
    onClose: () => {},
    transaction: {
      id: 2,
      reason: 'REFUND',
      type: 'DEBIT',
      status: 'closed',
      amount: 250,
      currency: 'usd',
      sourceId: 're_1AbCdEfGhIjKlMn',
      createdAt: '2026-08-05T10:00:00.000Z'
    }
  }
}

export const Loading: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: false,
    transaction: null
  }
}
