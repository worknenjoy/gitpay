import type { Meta, StoryObj } from '@storybook/react'
import PayoutDetailsAction from './payout-details-action'

const meta: Meta<typeof PayoutDetailsAction> = {
  title: 'Design Library/Molecules/Drawers/Actions/Payments/PayoutDetailsAction',
  component: PayoutDetailsAction,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof PayoutDetailsAction>

export const WhopCompleted: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: true,
    payout: {
      id: 1,
      source_id: 'wdrl_AfAlac3pCb3w5',
      method: 'whop',
      amount: 4250,
      currency: 'usd',
      status: 'completed',
      paid: true,
      reference_number: null,
      arrival_date: null,
      notified_status: 'completed',
      createdAt: '2026-08-21T08:13:57.000Z'
    }
  }
}

export const StripeInTransit: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: true,
    payout: {
      id: 2,
      source_id: 'po_1AbCdEfGhIjKlMn',
      method: 'card',
      amount: 12000,
      currency: 'usd',
      status: 'in_transit',
      paid: false,
      reference_number: 'trace_9f8e7d',
      arrival_date: Math.floor(new Date('2026-08-25T00:00:00.000Z').getTime() / 1000),
      createdAt: '2026-08-20T09:00:00.000Z'
    }
  }
}

export const Failed: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: true,
    payout: {
      id: 3,
      source_id: 'wdrl_denied_1',
      method: 'whop',
      amount: 5000,
      currency: 'usd',
      status: 'denied',
      paid: false,
      reference_number: null,
      arrival_date: null,
      createdAt: '2026-08-19T14:20:00.000Z'
    }
  }
}

export const Loading: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: false,
    payout: null
  }
}
