import React, { useState } from 'react'
import PayoutRequestDrawer from './payout-request-drawer'

const meta = {
  title: 'Design Library/Molecules/Drawers/PayoutRequestDrawer',
  component: PayoutRequestDrawer,
  args: {
    open: true,
    balance: 0,
    title: 'Request Payout',
    description: 'Please fill out the form to request payout'
  }
}

export default meta

const DefaultStory = (args) => {
  const [open, setOpen] = useState(true)

  return <PayoutRequestDrawer {...args} open={open} onClose={() => setOpen(false)} />
}

export const Default = {
  render: (args) => <DefaultStory {...args} />
}

export const WithBalance = {
  render: (args) => <PayoutRequestDrawer {...args} balance={200} open={true} onClose={() => {}} />,
  args: {
    title: 'Request Payout with Balance',
    description: 'You have sufficient balance to request payout'
  }
}
