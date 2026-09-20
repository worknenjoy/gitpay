import React from 'react'
import CodeIcon from '@mui/icons-material/Code'
import ListCard from './list-card'

const meta = {
  title: 'Design Library/Molecules/Cards/ListCard',
  component: ListCard
}

export default meta

const Template = (args) => <ListCard {...args} />

const WORK_ITEMS = [
  {
    meta: ['worknenjoy/gitpay', '#1284', 'assigned 4 days ago'],
    title: 'Payment request expiry is ignored when the link is reopened',
    chip: { label: 'Open', tone: 'success' as const },
    currency: '$',
    amount: '180.00'
  },
  {
    meta: ['worknenjoy/gitpay', '#1279', 'assigned 9 days ago'],
    title: 'Add Whop payout provider to the payout settings screen',
    chip: { label: 'Open', tone: 'success' as const },
    currency: '$',
    amount: '240.00'
  },
  {
    meta: ['worknenjoy/gitpay', '#1271', 'closed 6 Sep'],
    title: 'Fix wallet balance rounding on the dashboard cards',
    chip: { label: 'Closed', tone: 'error' as const },
    currency: '$',
    amount: '120.00'
  }
]

export const Default = Template.bind({})
Default.args = {
  title: 'Work items',
  subtitle: 'Issues you are working on',
  footer: 'See all your issues',
  items: WORK_ITEMS
}

export const WithHeaderLink = Template.bind({})
WithHeaderLink.args = {
  title: 'Work items',
  subtitle: 'Issues you are working on',
  link: 'See all',
  footer: 'See all your issues',
  items: WORK_ITEMS
}

export const Empty = Template.bind({})
Empty.args = {
  title: 'Work items',
  subtitle: 'Issues you are working on',
  items: [],
  emptyIcon: <CodeIcon fontSize="small" />,
  emptyText: 'Claim an issue from Explore and it shows up here while you work on it.',
  emptyActionText: 'Explore issues',
  onEmptyActionClick: () => alert('Explore issues clicked')
}

export const Loading = Template.bind({})
Loading.args = {
  title: 'Work items',
  subtitle: 'Issues you are working on',
  footer: 'See all your issues',
  items: [],
  completed: false
}

const MANY_WORK_ITEMS = [
  ...WORK_ITEMS,
  {
    meta: ['worknenjoy/gitpay', '#1262', 'assigned 12 days ago'],
    title: 'Show claim status on the contributor issue list',
    chip: { label: 'Open', tone: 'success' as const },
    currency: '$',
    amount: '64.81'
  },
  {
    meta: ['worknenjoy/gitpay-api', '#844', 'closed 2 Sep'],
    title: 'Retry failed transfers before marking a payout as failed',
    chip: { label: 'Closed', tone: 'error' as const },
    currency: '$',
    amount: '95.00'
  }
]

// Only the first `limit` items render — the rest are only reachable via the
// footer link. Defaults to 3, regardless of how many `items` are passed in.
export const DefaultLimit = Template.bind({})
DefaultLimit.args = {
  title: 'Work items',
  subtitle: 'Issues you are working on',
  footer: 'See all your issues',
  items: MANY_WORK_ITEMS
}

export const CustomLimit = Template.bind({})
CustomLimit.args = {
  title: 'Work items',
  subtitle: 'Issues you are working on',
  footer: 'See all your issues',
  items: MANY_WORK_ITEMS,
  limit: 5
}
