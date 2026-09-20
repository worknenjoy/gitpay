import React from 'react'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import MergeTypeIcon from '@mui/icons-material/MergeType'
import LinkIcon from '@mui/icons-material/Link'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import StatGroupCard from './stat-group-card'

const meta = {
  title: 'Design Library/Molecules/Cards/StatGroupCard',
  component: StatGroupCard
}

export default meta

const Template = (args) => <StatGroupCard {...args} />

export const Default = Template.bind({})
Default.args = {
  stats: [
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: 'Total earned',
      value: '4,293.20',
      currency: '$',
      note: 'for issues solved'
    },
    {
      icon: <MergeTypeIcon fontSize="small" />,
      label: 'Issues merged',
      value: '15',
      note: 'ready to payout'
    },
    { icon: <LinkIcon fontSize="small" />, label: 'Payment links', value: '3', note: '2 Active' },
    {
      icon: <AccessTimeIcon fontSize="small" />,
      label: 'Awaiting payout',
      value: '64.81',
      currency: '$',
      note: 'automatic payouts enabled'
    }
  ]
}

export const Loading = Template.bind({})
Loading.args = {
  stats: [
    { label: 'Total earned', value: '', completed: false },
    { label: 'Issues merged', value: '', completed: false },
    { label: 'Payment links', value: '', completed: false },
    { label: 'Awaiting payout', value: '', completed: false }
  ]
}
