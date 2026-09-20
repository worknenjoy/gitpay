import React from 'react'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import StatCard from './stat-card'
import StatGroupCard from './stat-group-card'

const meta = {
  title: 'Design Library/Molecules/Cards/StatCard',
  component: StatCard,
  args: {
    label: 'Total earned',
    value: '4,293.20',
    completed: true
  }
}

export default meta

const Template = (args) => <StatCard {...args} />

export const Default = Template.bind({})
Default.args = {}

export const WithIconCurrencyAndNote = Template.bind({})
WithIconCurrencyAndNote.args = {
  icon: <AccountBalanceWalletIcon fontSize="small" />,
  currency: '$',
  note: 'across 154 merged issues'
}

export const Loading = Template.bind({})
Loading.args = {
  completed: false
}

export const Group = () => (
  <StatGroupCard
    stats={[
      {
        icon: <AccountBalanceWalletIcon fontSize="small" />,
        label: 'Total earned',
        value: '4,293.20',
        currency: '$',
        note: 'across 154 merged issues'
      },
      { label: 'Issues merged', value: '154', note: '2 open right now' },
      { label: 'Payment links', value: '3', note: '2 Active' },
      { label: 'Awaiting payout', value: '64.81', currency: '$', note: 'automatic payouts enabled' }
    ]}
  />
)
