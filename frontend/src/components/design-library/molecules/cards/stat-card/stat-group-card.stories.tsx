import React from 'react'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
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
      note: 'across 154 merged issues'
    },
    { label: 'Issues merged', value: '154', note: '2 open right now' },
    { label: 'Active links', value: '3', note: '2 archived' },
    { label: 'Awaiting payout', value: '64.81', currency: '$', note: 'next run 14 Sep' }
  ]
}

export const Loading = Template.bind({})
Loading.args = {
  stats: [
    { label: 'Total earned', value: '', completed: false },
    { label: 'Issues merged', value: '', completed: false },
    { label: 'Active links', value: '', completed: false },
    { label: 'Awaiting payout', value: '', completed: false }
  ]
}
