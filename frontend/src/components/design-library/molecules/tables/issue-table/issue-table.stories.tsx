import type { Meta, StoryObj } from '@storybook/react'
import IssueTable from './issue-table' // adjust path if different

// If IssueTable uses a specific prop type, replace Record<string, any>
interface Issue {
  id: string | number
  title: string
  status?: string
  assignee?: string
  createdAt?: string
  [key: string]: any
}

const meta: Meta<typeof IssueTable> = {
  title: 'Design Library/Molecules/Tables/IssueTable',
  component: IssueTable,
  args: {
    issues: {
      completed: true,
      data: [
        {
          id: 101,
          title: 'Fix login redirect',
          status: 'open',
          assignee: 'alice',
          createdAt: '2025-10-01',
          Project: { name: 'Website Redesign' },
          value: '150',
          labels: ['bug', 'high priority'],
          languages: ['JavaScript', 'React'],
        },
        {
          id: 102,
          title: 'Refactor payment service',
          status: 'in_progress',
          assignee: 'bob',
          createdAt: '2025-10-02',
          Project: { name: 'Payment Gateway' },
          value: '100',
          labels: ['enhancement'],
          languages: ['JavaScript', 'Node.js'],
        },
        {
          id: 103,
          title: 'Update dependencies',
          status: 'closed',
          assignee: 'carol',
          createdAt: '2025-10-03',
        },
      ] as Issue[],
    },
  },
}

export default meta
type Story = StoryObj<typeof IssueTable>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    issues: {
      completed: true,
      data: [],
    } as any,
  },
}

export const Loading: Story = {
  args: {
    issues: {
      completed: false,
      data: [],
    } as any,
  },
}

export const ManyRows: Story = {
  args: {
    issues: {
      completed: true,
      data: Array.from({ length: 25 }).map((_, i) => ({
        id: 200 + i,
        title: `Generated issue ${i + 1}`,
        status: i % 3 === 0 ? 'open' : i % 3 === 1 ? 'in_progress' : 'closed',
        assignee: ['alice', 'bob', 'carol', 'dave'][i % 4],
        createdAt: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
      })) as Issue[],
    },
  },
}
