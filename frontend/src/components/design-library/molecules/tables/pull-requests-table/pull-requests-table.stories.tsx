import type { Meta, StoryObj } from '@storybook/react'
import PullRequestsTable from './pull-requests-table'

const meta: Meta<typeof PullRequestsTable> = {
  title: 'Design Library/Molecules/Tables/PullRequestsTable',
  component: PullRequestsTable,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof PullRequestsTable>

const sampleRows = [
  {
    id: 1,
    pullRequestURL: 'https://github.com/worknenjoy/gitpay/pull/1101',
    isPRMerged: true,
    isIssueClosed: true,
    createdAt: '2024-11-02T10:00:00Z',
    Task: { id: 1101, title: 'When accept the terms in account settings, redirect fails' }
  },
  {
    id: 2,
    pullRequestURL: 'https://github.com/worknenjoy/gitpay/pull/980',
    isPRMerged: false,
    isIssueClosed: false,
    createdAt: '2024-12-01T10:00:00Z',
    Task: { id: 980, title: 'Update readme with new setup instructions' }
  },
  {
    id: 3,
    pullRequestURL: 'https://github.com/worknenjoy/gitpay/pull/842',
    isPRMerged: false,
    isIssueClosed: true,
    createdAt: '2023-03-08T10:00:00Z',
    Task: { id: 842, title: 'Deadline in the issue page revisited' }
  }
]

export const Default: Story = {
  args: {
    pullRequests: { data: sampleRows, completed: true }
  }
}

export const Loading: Story = {
  args: {
    pullRequests: { data: [], completed: false }
  }
}

export const Empty: Story = {
  args: {
    pullRequests: { data: [], completed: true }
  }
}
