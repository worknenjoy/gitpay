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
