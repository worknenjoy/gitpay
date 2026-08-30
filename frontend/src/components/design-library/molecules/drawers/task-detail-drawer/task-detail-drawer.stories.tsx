import type { Meta, StoryObj } from '@storybook/react'
import TaskDetailDrawer, { TaskDetailDrawerTask } from './task-detail-drawer'

const sampleTask: TaskDetailDrawerTask = {
  id: 1142,
  title: 'Stripe webhook retries flaky in EU',
  description:
    'Investigate the reported behavior, reproduce locally with the steps in the comments, and submit a PR with tests covering the edge cases.',
  url: 'https://github.com/worknenjoy/gitpay/issues/1142',
  status: 'open',
  value: 150,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  Labels: [{ name: 'bug' }],
  Project: {
    name: 'gitpay',
    repo: 'gitpay',
    ProgrammingLanguages: [{ name: 'TypeScript' }]
  },
  User: { name: 'Maria Rodriguez' },
  Assign: [
    {
      status: 'accepted',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      User: { name: 'Jules' }
    }
  ],
  Orders: [
    {
      status: 'succeeded',
      amount: 150,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    }
  ]
}

const meta: Meta<typeof TaskDetailDrawer> = {
  title: 'Design Library/Molecules/Drawers/TaskDetailDrawer',
  component: TaskDetailDrawer,
  args: {
    open: true,
    onClose: () => {},
    task: sampleTask
  }
}
export default meta

type Story = StoryObj<typeof TaskDetailDrawer>

export const Default: Story = {}

export const Closed: Story = {
  args: {
    task: { ...sampleTask, status: 'closed' }
  }
}

export const Minimal: Story = {
  args: {
    task: {
      id: 5,
      title: 'Update readme',
      status: 'open',
      createdAt: new Date().toISOString()
    }
  }
}
