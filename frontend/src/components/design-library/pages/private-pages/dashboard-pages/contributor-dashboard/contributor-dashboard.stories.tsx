import React from 'react'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import MergeTypeIcon from '@mui/icons-material/MergeType'
import LinkIcon from '@mui/icons-material/Link'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import ContributorDashboard from './contributor-dashboard'

const meta = {
  title: 'Design Library/Pages/Private/DashboardPages/ContributorDashboard',
  component: ContributorDashboard,
  decorators: [withProfileTemplate]
}

export default meta

const Template = (args) => <ContributorDashboard {...args} />

export const Default = Template.bind({})
Default.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  payoutAlert: { balance: '$64.81' },
  stats: [
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: 'Total earned',
      currency: '$',
      value: '4,293.20',
      note: 'for issues solved'
    },
    {
      icon: <MergeTypeIcon fontSize="small" />,
      label: 'Issues merged',
      value: '15',
      note: 'ready to payout'
    },
    {
      icon: <LinkIcon fontSize="small" />,
      label: 'Payment links',
      value: '3',
      note: '2 Active'
    },
    {
      icon: <AccessTimeIcon fontSize="small" />,
      label: 'Awaiting payout',
      currency: '$',
      value: '64.81',
      note: 'automatic payouts enabled'
    }
  ],
  workItems: [
    {
      meta: ['worknenjoy/gitpay', '#1284', 'assigned 4 days ago'],
      title: 'Payment request expiry is ignored when the link is reopened',
      chip: { label: 'Open', tone: 'success' },
      currency: '$',
      amount: '180.00'
    },
    {
      meta: ['worknenjoy/gitpay', '#1279', 'assigned 9 days ago'],
      title: 'Add Whop payout provider to the payout settings screen',
      chip: { label: 'Open', tone: 'success' },
      currency: '$',
      amount: '240.00'
    },
    {
      meta: ['worknenjoy/gitpay', '#1271', 'closed 6 Sep'],
      title: 'Fix wallet balance rounding on the dashboard cards',
      chip: { label: 'Closed', tone: 'error' },
      currency: '$',
      amount: '120.00'
    }
  ],
  solutions: [
    {
      meta: ['worknenjoy/gitpay', '#1271', 'merged 6 Sep'],
      title: 'Fix wallet balance rounding on the dashboard cards',
      chip: { label: 'Merged', tone: 'success' },
      currency: '$',
      amount: '120.00',
      when: 'Paid'
    },
    {
      meta: ['worknenjoy/gitpay-api', '#844', 'merged 2 Sep'],
      title: 'Retry failed transfers before marking a payout as failed',
      chip: { label: 'Merged', tone: 'success' },
      currency: '$',
      amount: '95.00',
      when: 'Paid'
    },
    {
      meta: ['worknenjoy/gitpay', '#1262', 'merged 28 Aug'],
      title: 'Show claim status on the contributor issue list',
      chip: { label: 'Merged', tone: 'success' },
      currency: '$',
      amount: '64.81',
      when: 'In transit'
    }
  ],
  payouts: [
    {
      meta: ['PO-2291', 'USD'],
      title: 'Bank account ·· 4512',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '215.00',
      when: '6 Sep'
    },
    {
      meta: ['PO-2274', 'USD'],
      title: 'Bank account - 1222',
      chip: { label: 'In transit', tone: 'warning' },
      currency: '$',
      amount: '64.81',
      when: '2 Sep'
    },
    {
      meta: ['PO-2240', 'USD'],
      title: 'Bank account ·· 4512',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '51.94',
      when: '24 Aug'
    }
  ],
  checklistProgress: { completed: 3, total: 4 },
  checklistItems: [
    { label: 'Account created', state: 'checked' },
    { label: 'GitHub account connected', state: 'checked' },
    { label: 'First issue claimed', state: 'checked' },
    { label: 'Payout account connected', state: 'empty' }
  ],
  claims: [
    {
      items: [
        { label: 'For bounties', value: '$32.42' },
        { label: 'For payment requests', value: '$5' },
        { label: 'Total', value: '$64.81', variant: 'emphasis' }
      ]
    }
  ],
  payoutsSummary: [
    {
      items: [
        { label: 'Paid out', value: '$51.94' },
        { label: 'In transit', value: '$9.06' },
        { label: 'Total', value: '$1.83', variant: 'emphasis' }
      ]
    }
  ]
}

export const Loading = Template.bind({})
Loading.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  completed: false,
  stats: Default.args.stats,
  workItems: [],
  solutions: [],
  payouts: [],
  checklistProgress: { completed: 0, total: 4 },
  checklistItems: Default.args.checklistItems,
  claims: [],
  payoutsSummary: []
}

export const Empty = Template.bind({})
Empty.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  stats: [
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: 'Total earned',
      currency: '$',
      value: '0.00',
      note: 'no merged issues yet'
    },
    {
      icon: <MergeTypeIcon fontSize="small" />,
      label: 'Issues merged',
      value: '0',
      note: 'none open right now'
    },
    {
      icon: <LinkIcon fontSize="small" />,
      label: 'Active links',
      value: '0',
      note: 'none created'
    },
    {
      icon: <AccessTimeIcon fontSize="small" />,
      label: 'Awaiting payout',
      currency: '$',
      value: '0.00',
      note: 'nothing in the queue'
    }
  ],
  workItems: [],
  solutions: [],
  payouts: [],
  checklistProgress: { completed: 1, total: 4 },
  checklistItems: [
    { label: 'Account created', state: 'checked' },
    { label: 'GitHub account connected', state: 'empty' },
    { label: 'First issue claimed', state: 'empty' },
    { label: 'Payout account connected', state: 'empty' }
  ],
  claims: [
    {
      items: [
        { label: 'For bounties', value: '$0.00' },
        { label: 'For payment requests', value: '$0.00' },
        { label: 'Total', value: '$0.00', variant: 'emphasis' }
      ]
    }
  ],
  // payoutAlert and payoutsSummary omitted: nothing to pay out yet
  onExploreIssuesClick: () => alert('Explore issues clicked'),
  onConnectPayoutClick: () => alert('Connect a payout method clicked')
}
