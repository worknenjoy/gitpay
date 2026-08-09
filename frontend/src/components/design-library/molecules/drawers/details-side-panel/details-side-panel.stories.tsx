import type { Meta, StoryObj } from '@storybook/react'
import DetailsSidePanel from './details-side-panel'

const meta: Meta<typeof DetailsSidePanel> = {
  title: 'Design Library/Molecules/Drawers/DetailsSidePanel',
  component: DetailsSidePanel,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof DetailsSidePanel>

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Payment details',
    subtitle: 'Breakdown of this payment',
    completed: true,
    sections: [
      {
        title: 'Breakdown',
        items: [
          { label: 'Customer paid', value: '$1.00' },
          { label: 'Fees', value: '-$0.43', variant: 'negative' },
          { label: 'Net amount', value: '$0.57', variant: 'emphasis' }
        ]
      },
      {
        title: 'Payment info',
        items: [
          { label: 'Status', value: 'Paid' },
          { label: 'Customer', value: 'customer@example.com' },
          { label: 'Provider', value: 'whop' },
          { label: 'Payment ID', value: 'pay_abc123' },
          { label: 'Created', value: 'Aug 9, 12:54 PM' }
        ]
      },
      {
        title: 'Activity',
        items: [{ label: 'Payment completed', value: 'Aug 9, 12:54 PM' }]
      }
    ]
  }
}

export const Loading: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Payment details',
    completed: false,
    sections: []
  }
}

export const EmptySections: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Details',
    completed: true,
    sections: [
      {
        title: 'Info',
        items: []
      }
    ]
  }
}

export const SingleSection: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Account details',
    completed: true,
    sections: [
      {
        items: [
          { label: 'Name', value: 'Jane Doe' },
          { label: 'Email', value: 'jane@example.com' },
          { label: 'Role', value: 'Admin' }
        ]
      }
    ]
  }
}
