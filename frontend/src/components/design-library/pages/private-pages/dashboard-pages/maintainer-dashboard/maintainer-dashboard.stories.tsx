import React from 'react'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AssignmentIcon from '@mui/icons-material/Assignment'
import GroupsIcon from '@mui/icons-material/Groups'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import MaintainerDashboard from './maintainer-dashboard'

const meta = {
  title: 'Design Library/Pages/Private/DashboardPages/MaintainerDashboard',
  component: MaintainerDashboard,
  decorators: [withProfileTemplate]
}

export default meta

const Template = (args) => <MaintainerDashboard {...args} />

export const Default = Template.bind({})
Default.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  stats: [
    {
      icon: <AttachMoneyIcon fontSize="small" />,
      label: 'Paid to contributors',
      currency: '$',
      value: '4,293.20',
      note: 'across 159 payments'
    },
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: 'Wallet balance',
      currency: '$',
      value: '0.00',
      note: '1 wallet created'
    },
    {
      icon: <AssignmentIcon fontSize="small" />,
      label: 'Open bounties',
      value: '2',
      note: '$350.00 committed'
    },
    {
      icon: <GroupsIcon fontSize="small" />,
      label: 'Projects',
      value: '39',
      note: 'in 4 organizations'
    }
  ],
  openIssues: [
    {
      meta: ['worknenjoy/gitpay', '#1284', 'alexanmtz assigned'],
      title: 'Payment request expiry is ignored when the link is reopened',
      chip: { label: 'Open', tone: 'success' },
      currency: '$',
      amount: '180.00'
    },
    {
      meta: ['worknenjoy/gitpay', '#1279', 'PR #1301 open'],
      title: 'Add Whop payout provider to the payout settings screen',
      chip: { label: 'Open', tone: 'success' },
      currency: '$',
      amount: '240.00'
    }
  ],
  closedIssues: [
    {
      meta: ['worknenjoy/gitpay', '#1271', 'merged 6 Sep'],
      title: 'Fix wallet balance rounding on the dashboard cards',
      chip: { label: 'Closed', tone: 'neutral' },
      currency: '$',
      amount: '120.00',
      when: 'lucasmiguel'
    },
    {
      meta: ['worknenjoy/gitpay-api', '#844', 'merged 2 Sep'],
      title: 'Retry failed transfers before marking a payout as failed',
      chip: { label: 'Closed', tone: 'neutral' },
      currency: '$',
      amount: '95.00',
      when: 'dcaiafa'
    }
  ],
  recentPayments: [
    {
      meta: ['card', 'issue #1271'],
      title: 'Bounty released to lucasmiguel',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '120.00',
      when: '6 Sep'
    },
    {
      meta: ['wallet', 'issue #844'],
      title: 'Bounty released to dcaiafa',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '95.00',
      when: '2 Sep'
    },
    {
      meta: ['card', 'issue #1279'],
      title: 'Bounty escrowed, awaiting merge',
      chip: { label: 'In escrow', tone: 'warning' },
      currency: '$',
      amount: '240.00',
      when: '29 Aug'
    }
  ],
  checklistProgress: { completed: 2, total: 3 },
  checklistItems: [
    { label: 'Account created', state: 'checked' },
    { label: 'First issue funded', state: 'checked' },
    { label: 'First issue paid', state: 'empty' }
  ],
  wallet: [
    {
      items: [
        { label: 'Balance', value: '$0.00' },
        { label: 'Spend from wallet', value: '$1,240.00' },
        { label: 'Pending', value: '$420.00' }
      ]
    }
  ],
  onFundIssueClick: () => alert('Fund an issue clicked'),
  onViewOpenIssuesClick: () => alert('See all your issues clicked'),
  onViewClosedIssuesClick: () => alert('See all closed issues clicked'),
  onViewPaymentsClick: () => alert('See all your payments clicked'),
  onManageWalletClick: () => alert('Manage wallet clicked')
}

export const Loading = Template.bind({})
Loading.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  completed: false,
  stats: Default.args.stats,
  openIssues: [],
  closedIssues: [],
  recentPayments: [],
  checklistProgress: { completed: 0, total: 3 },
  checklistItems: Default.args.checklistItems,
  wallet: []
}

export const Empty = Template.bind({})
Empty.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  stats: [
    {
      icon: <AttachMoneyIcon fontSize="small" />,
      label: 'Paid to contributors',
      currency: '$',
      value: '0.00',
      note: 'no payments yet'
    },
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: 'Wallet balance',
      currency: '$',
      value: '0.00',
      note: 'no wallet created'
    },
    {
      icon: <AssignmentIcon fontSize="small" />,
      label: 'Open bounties',
      value: '0',
      note: 'nothing committed'
    },
    {
      icon: <GroupsIcon fontSize="small" />,
      label: 'Projects',
      value: '0',
      note: 'none created yet'
    }
  ],
  openIssues: [],
  closedIssues: [],
  recentPayments: [],
  checklistProgress: { completed: 1, total: 3 },
  checklistItems: [
    { label: 'Account created', state: 'checked' },
    { label: 'First issue funded', state: 'empty' },
    { label: 'First issue paid', state: 'empty' }
  ],
  wallet: [
    {
      items: [
        { label: 'Balance', value: '$0.00' },
        { label: 'Spend from wallet', value: '$0.00' },
        { label: 'Pending', value: '$0.00' }
      ]
    }
  ],
  onFundIssueClick: () => alert('Fund an issue clicked'),
  onManageWalletClick: () => alert('Manage wallet clicked')
}
