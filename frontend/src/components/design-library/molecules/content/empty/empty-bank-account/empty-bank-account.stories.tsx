import React from 'react'
import EmptyBankAccount from './empty-bank-account'

export default {
  title: 'Design Library/Molecules/Empty/EmptyBankAccount',
  component: EmptyBankAccount
}

const Template = (args) => <EmptyBankAccount {...args} />

export const Default = Template.bind({})
Default.args = {}
