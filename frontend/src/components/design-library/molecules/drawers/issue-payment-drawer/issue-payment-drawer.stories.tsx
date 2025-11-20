import React, { useState } from 'react'

// Require after env setup to avoid early Stripe initialization with undefined key
// eslint-disable-next-line @typescript-eslint/no-var-requires
const IssuePaymentDrawer = require('./issue-payment-drawer').default

const meta = {
  title: 'Design Library/Molecules/Drawers/IssuePaymentDrawer',
  component: IssuePaymentDrawer
}

export default meta

const Template = (args) => {
  const [open, setOpen] = useState(true)

  return <IssuePaymentDrawer {...args} open={open} onClose={() => setOpen(false)} />
}

export const Default = Template.bind({})
Default.args = {
  // minimal mocks to let tabs render safely
  addNotification: () => {},
  updateTask: async () => {},
  createOrder: async () => ({ data: { id: 'ord_123', payment_url: 'https://example.com/pay' } }),
  fetchCustomer: async () => {},
  fetchWallet: async () => {},
  listWallets: async () => {},
  fetchTask: async () => {},
  syncTask: async () => {},
  order: { completed: true, data: { id: 'ord_123', payment_url: 'https://example.com/pay' } },
  customer: { completed: true, data: { name: 'Acme Inc.', address: {} } },
  wallets: { completed: true, data: [{ id: 1, name: 'Main Wallet' }] },
  wallet: { completed: true, data: { id: 1, name: 'Main Wallet', balance: 1500 } },
  user: { id: 1, email: 'dev@example.com', name: 'Dev User', customer_id: 'cus_test_123' },
  task: { completed: true, data: { id: 101, private: false } }
}
