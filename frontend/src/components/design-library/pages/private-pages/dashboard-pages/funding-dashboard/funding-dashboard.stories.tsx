import React from 'react'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import FundingDashboard from './funding-dashboard'

const meta = {
  title: 'Design Library/Pages/Private/DashboardPages/FundingDashboard',
  component: FundingDashboard,
  decorators: [withProfileTemplate]
}

export default meta

const Template = (args) => <FundingDashboard {...args} />

export const Default = Template.bind({})
Default.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  stats: [
    {
      icon: <AttachMoneyIcon fontSize="small" />,
      label: 'Funded',
      currency: '$',
      value: '24,800',
      note: 'across 10 projects'
    },
    {
      icon: <TrendingUpIcon fontSize="small" />,
      label: 'Payments',
      value: '42',
      note: '$24,800 processed'
    },
    {
      icon: <FavoriteIcon fontSize="small" />,
      label: 'Projects sponsored',
      value: '9',
      note: '3 monthly · 6 one-time'
    },
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: 'Wallet balance',
      currency: '$',
      value: '0.00',
      note: '1 wallet created'
    }
  ],
  recentPayments: [
    {
      meta: ['card', 'worknenjoy/gitpay'],
      title: 'Gitpay core development, monthly',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '600.00',
      when: '12 Sep'
    },
    {
      meta: ['card', 'nodejs/node'],
      title: 'Node.js maintenance fund, monthly',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '400.00',
      when: '12 Sep'
    },
    {
      meta: ['card', 'vitejs/vite'],
      title: 'Build tooling sprint',
      chip: { label: 'Paid', tone: 'success' },
      currency: '$',
      amount: '1,500.00',
      when: '4 Sep'
    },
    {
      meta: ['card', 'worknenjoy/gitpay #1279'],
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
    { label: 'First project sponsored', state: 'checked' },
    { label: 'Wallet topped up', state: 'empty' }
  ],
  wallet: [
    {
      items: [
        { label: 'Balance', value: '$0.00' },
        { label: 'Spend from wallet', value: '$3,180.00' },
        { label: 'Pending', value: '$240.00' }
      ]
    }
  ],
  onSponsorProjectClick: () => alert('Sponsor a project clicked'),
  onViewPaymentsClick: () => alert('See all your payments clicked'),
  onManageWalletClick: () => alert('Manage wallet clicked')
}

export const Loading = Template.bind({})
Loading.args = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  completed: false,
  stats: Default.args.stats,
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
      label: 'Funded',
      currency: '$',
      value: '0.00',
      note: 'no projects funded yet'
    },
    {
      icon: <TrendingUpIcon fontSize="small" />,
      label: 'Payments',
      value: '0',
      note: 'none processed'
    },
    {
      icon: <FavoriteIcon fontSize="small" />,
      label: 'Projects sponsored',
      value: '0',
      note: 'none yet'
    },
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: 'Wallet balance',
      currency: '$',
      value: '0.00',
      note: 'no wallet created'
    }
  ],
  recentPayments: [],
  checklistProgress: { completed: 1, total: 3 },
  checklistItems: [
    { label: 'Account created', state: 'checked' },
    { label: 'First project sponsored', state: 'empty' },
    { label: 'Wallet topped up', state: 'empty' }
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
  onSponsorProjectClick: () => alert('Sponsor a project clicked'),
  onManageWalletClick: () => alert('Manage wallet clicked')
}
