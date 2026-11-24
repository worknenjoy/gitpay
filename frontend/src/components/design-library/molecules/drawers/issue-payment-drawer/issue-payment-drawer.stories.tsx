import React, { useState } from 'react'

// Require after env setup to avoid early Stripe initialization with undefined key
// eslint-disable-next-line @typescript-eslint/no-var-requires
const IssuePaymentDrawer = require('./issue-payment-drawer').default

const meta = {
  title: 'Design Library/Molecules/Drawers/IssuePaymentDrawer',
  component: IssuePaymentDrawer,
  parameters: { layout: 'fullscreen' }
}

export default meta

const Template = (args) => {
  const [open, setOpen] = useState(true)

  return <IssuePaymentDrawer {...args} open={open} onClose={() => setOpen(false)} />
}

const baseArgs = {
  addNotification: () => {},
  updateTask: async () => {},
  createOrder: async () => ({ data: { id: 'ord_123', payment_url: 'https://example.com/pay' } }),
  fetchCustomer: async () => {},
  fetchWallet: async () => {},
  listWallets: async () => {},
  fetchTask: async () => {},
  syncTask: async () => {},
  order: { completed: true, data: { id: 'ord_123', payment_url: 'https://example.com/pay' } },
  customer: { completed: true, data: { name: 'RetroShare e.V.', address: {} } },
  wallets: { completed: true, data: [{ id: 1, name: 'RetroShare wallet' }] },
  wallet: { completed: true, data: { id: 1, name: 'RetroShare wallet', balance: 420 } },
  user: {
    completed: true,
    data: { id: 1, email: 'dev@example.com', name: 'Dev User', customer_id: 'cus_test_123' }
  },
  task: { completed: true, data: { id: 101, private: false } },
  price: 100
}

/** Add bounty · card (today). */
export const Card = Template.bind({})
Card.args = baseArgs

/** Add bounty · invoice. */
export const Invoice = Template.bind({})
Invoice.args = { ...baseArgs, initialMethod: 'invoice' }

/** Add bounty · wallet. */
export const Wallet = Template.bind({})
Wallet.args = { ...baseArgs, initialMethod: 'wallet' }

/** Add bounty · wallet, not enough balance. */
export const WalletInsufficient = Template.bind({})
WalletInsufficient.args = {
  ...baseArgs,
  initialMethod: 'wallet',
  wallets: { completed: true, data: [{ id: 2, name: 'Personal wallet' }] },
  wallet: { completed: true, data: { id: 2, name: 'Personal wallet', balance: 35 } }
}

/** Add bounty · pay now, with the pay-later switch (when pledges are available). */
export const PayNowWithPayLater = Template.bind({})
PayNowWithPayLater.args = { ...baseArgs, onPledge: () => {} }

/** Add bounty · pay later (pledge). */
export const PayLater = Template.bind({})
PayLater.args = { ...baseArgs, onPledge: () => {}, initialWhen: 'later' }
