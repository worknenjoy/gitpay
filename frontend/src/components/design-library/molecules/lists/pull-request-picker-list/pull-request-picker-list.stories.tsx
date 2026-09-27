import React from 'react'
import type { Meta } from '@storybook/react'
import PullRequestPickerList, { PullRequestPickerRow } from './pull-request-picker-list'

const meta: Meta<typeof PullRequestPickerList> = {
  title: 'Design Library/Molecules/Lists/PullRequestPickerList',
  component: PullRequestPickerList,
  parameters: { layout: 'padded' }
}

export default meta

const samplePullRequests: PullRequestPickerRow[] = [
  {
    repo: 'worknenjoy/gitpay',
    number: 1301,
    title: 'Add Whop payout provider to the payout settings screen',
    when: '2 days ago',
    state: 'open'
  },
  {
    repo: 'worknenjoy/gitpay',
    number: 1288,
    title: 'Fix currency rounding on payout summary',
    when: '1 week ago',
    state: 'open'
  },
  {
    repo: 'vercel/next.js',
    number: 70412,
    title: 'Docs: clarify revalidate option for fetch',
    when: '2 weeks ago',
    state: 'open'
  },
  {
    repo: 'worknenjoy/gitpay',
    number: 1264,
    title: 'Migrate issue page to the new layout',
    when: '1 month ago',
    state: 'closed'
  },
  {
    repo: 'stripe/stripe-node',
    number: 2150,
    title: 'Add typings for payout reconciliation',
    when: '2 months ago',
    state: 'closed'
  }
]

const sampleOwners = [
  { id: 'alexanmtz', kind: 'User' },
  { id: 'worknenjoy', kind: 'Organization' },
  { id: 'vercel', kind: 'Organization' },
  { id: 'stripe', kind: 'Organization' }
]

const StatefulTemplate = (args: any) => {
  const [filter, setFilter] = React.useState<'open' | 'closed'>(args.filter)
  const [owner, setOwner] = React.useState(args.owner)
  const [repo, setRepo] = React.useState(args.repo)
  const [value, setValue] = React.useState(args.value)

  return (
    <PullRequestPickerList
      {...args}
      filter={filter}
      onFilterChange={setFilter}
      owner={owner}
      onOwnerChange={setOwner}
      repo={repo}
      onRepoChange={setRepo}
      value={value}
      onChange={setValue}
    />
  )
}

export const WithResults = {
  render: StatefulTemplate,
  args: {
    pullRequests: samplePullRequests,
    owners: sampleOwners,
    filter: 'open',
    owner: 'all',
    repo: 'all',
    value: 1301
  }
}

export const Empty = {
  render: StatefulTemplate,
  args: {
    pullRequests: samplePullRequests,
    owners: sampleOwners,
    filter: 'closed',
    owner: 'vercel',
    repo: 'all',
    value: undefined
  }
}

export const Loading = {
  render: StatefulTemplate,
  args: {
    pullRequests: samplePullRequests,
    owners: sampleOwners,
    filter: 'open',
    owner: 'all',
    repo: 'all',
    loading: true
  }
}
