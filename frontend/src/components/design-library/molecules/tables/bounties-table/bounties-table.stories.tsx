import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import BountiesTable from './bounties-table'

const meta: Meta<typeof BountiesTable> = {
  title: 'Design Library/Molecules/Tables/BountiesTable',
  component: BountiesTable,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof BountiesTable>

const sampleRows = [
  {
    id: 1,
    title: 'When accept the terms in account settings, redirect fails',
    status: 'closed',
    value: 50,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/1101',
    Labels: [
      { id: 'bug', name: 'bug' },
      { id: 'good-first-issue', name: 'good first issue' }
    ],
    Project: {
      id: 1,
      OrganizationId: 1,
      name: 'gitpay',
      ProgrammingLanguages: [
        { id: 'ts', name: 'TypeScript' },
        { id: 'mdx', name: 'MDX' }
      ]
    },
    createdAt: '2024-11-02T10:00:00Z'
  },
  {
    id: 2,
    title: 'Update readme with new setup instructions',
    status: 'open',
    value: 0,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/980',
    Labels: [{ id: 'first-issue', name: 'first-issue' }],
    Project: {
      id: 1,
      OrganizationId: 1,
      name: 'gitpay',
      ProgrammingLanguages: [{ id: 'mdx', name: 'MDX' }]
    },
    createdAt: '2019-05-14T10:00:00Z'
  },
  {
    id: 3,
    title: 'Deadline in the issue page revisited',
    status: 'closed',
    value: 43.2,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/842',
    Labels: [
      { id: 'help-wanted', name: 'help wanted' },
      { id: 'react', name: 'react' }
    ],
    Project: {
      id: 1,
      OrganizationId: 1,
      name: 'gitpay',
      ProgrammingLanguages: [
        { id: 'mdx', name: 'MDX' },
        { id: 'html', name: 'HTML' }
      ]
    },
    createdAt: '2023-03-08T10:00:00Z'
  }
]

export const Default: Story = {
  args: {
    issues: { data: sampleRows, completed: true },
    onViewDetails: action('onViewDetails')
  }
}

export const Loading: Story = {
  args: {
    issues: { data: [], completed: false },
    onViewDetails: action('onViewDetails')
  }
}

export const Empty: Story = {
  args: {
    issues: { data: [], completed: true },
    onViewDetails: action('onViewDetails')
  }
}
