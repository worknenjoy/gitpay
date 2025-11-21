import type { Meta, StoryObj } from '@storybook/react'
import IssueOrderTransferAction from './issue-order-transfer-action'

const meta: Meta<typeof IssueOrderTransferAction> = {
  title: 'Design Library/Molecules/Drawers/Actions/Payments/IssueOrderTransferAction',
  component: IssueOrderTransferAction,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof IssueOrderTransferAction>

export const Default: Story = {
  args: {
    open: true,
    task: { id: 1, title: 'Issue 1', status: 'open', paid: false },
    tasks: {
      completed: true,
      data: [
        { id: 1, title: 'Issue 1', status: 'open', paid: false },
        { id: 2, title: 'Issue 2', status: 'closed', paid: false },
        { id: 3, title: 'Issue 3', status: 'open', paid: true }
      ]
    },
    order: {
      id: 123,
      amount: 5000,
      currency: 'USD'
    },
    onSend: (taskId: number) => {
      console.log(`Transfer sent to task ID: ${taskId}`)
    },
    onClose: () => {
      console.log('Drawer closed')
    },
    listOrders: () => {
      console.log('List orders called')
    }
  }
}

export const Loading: Story = {
  args: {
    open: true,
    task: {},
    tasks: {
      completed: false,
      data: []
    },
    order: {
      id: 123,
      amount: 5000,
      currency: 'USD'
    },
    onSend: (taskId: number) => {
      console.log(`Transfer sent to task ID: ${taskId}`)
    },
    onClose: () => {
      console.log('Drawer closed')
    },
    listOrders: () => {
      console.log('List orders called')
    }
  }
}
