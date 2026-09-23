import type { Meta, StoryObj } from '@storybook/react'
import IssueOrderDetailsAction from './issue-order-details-action'

const meta: Meta<typeof IssueOrderDetailsAction> = {
  title: 'Design Library/Molecules/Drawers/Actions/Payments/IssueOrderDetailsAction',
  component: IssueOrderDetailsAction,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof IssueOrderDetailsAction>

const task = {
  id: 1146,
  title: 'Fix flaky checkout test',
  url: 'https://github.com/test/repo/issues/123',
  provider: 'github'
}

export const Default: Story = {
  args: {
    open: true,
    order: {
      completed: true,
      data: {
        status: 'succeeded',
        provider: 'stripe',
        source_id: 'ch_test_source_id_123',
        amount: '100.00',
        currency: 'USD',
        createdAt: '2024-01-01T12:00:00Z'
      }
    },
    task,
    onClose: () => {},
    onCancel: () => {}
  }
}

export const PayPalPendingCancel: Story = {
  args: {
    open: true,
    order: {
      completed: true,
      data: {
        id: 866,
        source_id: 'test_source_id_123',
        authorization_id: 'test_authorization_id_123',
        provider: 'paypal',
        currency: 'USD',
        amount: '50',
        payment_url: 'https://www.paypal.com/checkoutnow?token=test_token_123',
        status: 'open',
        paypal: { status: 'APPROVED' },
        createdAt: '2025-05-22T13:42:55.044Z'
      }
    },
    task,
    onClose: () => {},
    onCancel: () => {}
  }
}

export const Loading: Story = {
  args: {
    open: true,
    order: {
      completed: false,
      data: {}
    },
    task,
    onClose: () => {},
    onCancel: () => {}
  }
}

export const NoBounty: Story = {
  args: {
    open: true,
    order: {
      completed: true,
      data: {
        status: 'succeeded',
        provider: 'stripe',
        source_id: 'ch_test_source_id_456',
        amount: '25.00',
        currency: 'USD',
        createdAt: '2024-01-01T12:00:00Z'
      }
    },
    task: null,
    onClose: () => {},
    onCancel: () => {}
  }
}
