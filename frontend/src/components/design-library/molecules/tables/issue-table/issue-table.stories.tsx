import type { Meta, StoryObj } from '@storybook/react'
import IssueTable from './issue-table'

const gitpayProject = {
  id: 1,
  name: 'gitpay',
  OrganizationId: 1,
  ProgrammingLanguages: [{ name: 'TypeScript' }, { name: 'React' }]
}

const exploreProject = {
  id: 2,
  name: 'explore',
  OrganizationId: 1,
  ProgrammingLanguages: [{ name: 'CSS' }, { name: 'JavaScript' }]
}

const meta: Meta<typeof IssueTable> = {
  title: 'Design Library/Molecules/Tables/IssueTable',
  component: IssueTable,
  args: {
    labels: [],
    languages: [],
    filterTasks: () => {},
    listTasks: () => {},
    issues: {
      completed: true,
      data: [
        {
          id: 101,
          title: 'Update readme',
          status: 'open',
          createdAt: new Date(Date.now() - 7 * 365 * 86400000).toISOString(),
          value: '0',
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/1',
          Labels: [{ name: 'first-issue' }],
          Project: gitpayProject
        },
        {
          id: 102,
          title: 'Stripe webhook retries flaky in EU',
          status: 'closed',
          createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
          value: '150',
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/2',
          Labels: [{ name: 'bug' }],
          Project: gitpayProject
        },
        {
          id: 103,
          title: 'Add language to issue on explore',
          status: 'closed',
          createdAt: new Date(Date.now() - 2 * 365 * 86400000).toISOString(),
          value: '50',
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/3',
          Labels: [],
          Project: exploreProject
        },
        {
          id: 104,
          title: 'Fix Lint issues',
          status: 'closed',
          createdAt: new Date(Date.now() - 2 * 365 * 86400000).toISOString(),
          value: '20',
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/4',
          Labels: [{ name: 'beginner' }],
          Project: {
            id: 1,
            name: 'gitpay',
            OrganizationId: 1,
            ProgrammingLanguages: [{ name: 'JavaScript' }, { name: 'TypeScript' }]
          }
        }
      ]
    }
  }
}

export default meta
type Story = StoryObj<typeof IssueTable>

export const Default: Story = {}

export const WithLabelsAndLanguages: Story = {
  args: {
    issues: {
      completed: true,
      data: [
        {
          id: 201,
          title: 'Add TypeScript support to all components',
          status: 'open',
          createdAt: new Date(Date.now() - 7 * 365 * 86400000).toISOString(),
          value: '150',
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/201',
          Labels: [{ name: 'enhancement' }, { name: 'typescript' }, { name: 'good-first-issue' }],
          Project: {
            id: 1,
            name: 'gitpay',
            OrganizationId: 1,
            ProgrammingLanguages: [{ name: 'TypeScript' }, { name: 'JavaScript' }]
          }
        },
        {
          id: 202,
          title: 'Fix CSS regression in dark mode',
          status: 'closed',
          createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
          value: '0',
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/202',
          Labels: [{ name: 'bug' }],
          Project: {
            id: 2,
            name: 'explore',
            OrganizationId: 1,
            ProgrammingLanguages: [{ name: 'CSS' }, { name: 'MDX' }]
          }
        },
        {
          id: 203,
          title: 'Improve Python data pipeline',
          status: 'open',
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
          value: '200',
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/203',
          Labels: [{ name: 'backend' }, { name: 'performance' }],
          Project: {
            id: 3,
            name: 'data-tools',
            OrganizationId: 1,
            ProgrammingLanguages: [{ name: 'Python' }, { name: 'Go' }]
          }
        }
      ]
    }
  }
}

export const WithMixedValues: Story = {
  args: {
    issues: {
      completed: true,
      data: [
        {
          id: 301,
          title: 'Issue with bounty and full project info',
          status: 'open',
          createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          value: '500',
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/301',
          Labels: [{ name: 'bounty' }],
          Project: gitpayProject
        },
        {
          id: 302,
          title: 'Issue with no bounty and no labels',
          status: 'open',
          createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
          value: '0',
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/302',
          Labels: [],
          Project: gitpayProject
        },
        {
          id: 303,
          title: 'Issue with no project info',
          status: 'closed',
          createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
          value: '75',
          provider: 'github',
          url: 'https://github.com/worknenjoy/gitpay/issues/303',
          Labels: [{ name: 'wontfix' }],
          Project: null
        }
      ]
    }
  }
}

export const Empty: Story = {
  args: {
    issues: {
      completed: true,
      data: []
    } as any
  }
}

export const Loading: Story = {
  args: {
    issues: {
      completed: false,
      data: []
    } as any
  }
}

export const ManyRows: Story = {
  args: {
    issues: {
      completed: true,
      data: Array.from({ length: 25 }).map((_, i) => ({
        id: 400 + i,
        title: `Generated issue ${i + 1} — some longer title to test ellipsis`,
        status: i % 2 === 0 ? 'open' : 'closed',
        createdAt: new Date(Date.now() - i * 7 * 86400000).toISOString(),
        value: i % 3 === 0 ? '0' : String((i + 1) * 25),
        provider: 'github',
        url: `https://github.com/worknenjoy/gitpay/issues/${400 + i}`,
        Labels: i % 3 === 0 ? [] : [{ name: ['bug', 'feature', 'enhancement', 'beginner'][i % 4] }],
        Project:
          i % 4 === 0
            ? null
            : {
                id: (i % 3) + 1,
                name: ['gitpay', 'explore', 'data-tools'][i % 3],
                OrganizationId: 1,
                ProgrammingLanguages: [
                  { name: ['TypeScript', 'JavaScript', 'Python', 'Go', 'CSS'][i % 5] },
                  { name: ['JavaScript', 'TypeScript', 'Go', 'Ruby', 'MDX'][(i + 1) % 5] }
                ]
              }
      }))
    }
  }
}
