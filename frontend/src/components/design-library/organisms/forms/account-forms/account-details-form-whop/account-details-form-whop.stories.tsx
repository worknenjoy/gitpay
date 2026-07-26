import React from 'react'
import AccountDetailsFormWhop from './account-details-form-whop'

export default {
  title: 'Design Library/Organisms/Forms/AccountForms/AccountDetailsFormWhop',
  component: AccountDetailsFormWhop
}

const Template = (args) => <AccountDetailsFormWhop {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    whop_account_id: 'biz_whop_123'
  },
  account: {
    completed: true,
    data: {
      id: 'biz_whop_123',
      provider: 'whop',
      active: true,
      title: 'Jane Consulting LLC',
      email: 'jane@example.com',
      country: 'US',
      verified: true,
      created_at: '2026-03-01T12:00:00.000Z',
      route: 'jane-consulting',
      url: 'https://whop.com/jane-consulting',
      capabilities: { transfers: 'active' },
      balances: { available: 250.75, pending: 18.2, reserve: 0 }
    }
  },
  onCompleteVerification: () => alert('Open Whop verification'),
  onConfirmCloseAccount: () => alert('Close account')
}

export const Loading = Template.bind({})
Loading.args = {
  user: { id: 1 },
  account: { completed: false, data: {} }
}
