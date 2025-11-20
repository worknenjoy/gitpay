import React from 'react'
import BalanceCard from './balance-card'

const meta = {
  title: 'Design Library/Molecules/Cards/BalanceCard',
  component: BalanceCard,
  args: {
    balance: 1500,
    currency: 'USD',
    name: 'Available Balance',
    completed: true
  }
}

const Template = (args) => <BalanceCard {...args} />

export default meta

export const Default = Template.bind({})
Default.args = {}

export const Centavos = Template.bind({})
Centavos.args = {
  type: 'centavos'
}

export const Loading = Template.bind({})
Loading.args = {
  completed: false
}
