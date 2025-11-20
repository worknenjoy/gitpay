import React from 'react'
import IssuePaymentsList from './issue-payments-list'

export default {
  title: 'Design Library/Molecules/Lists/IssuePaymentsList',
  component: IssuePaymentsList
}

const Template = (args) => <IssuePaymentsList {...args} />

export const Default = Template.bind({})
Default.args = {
  orders: [
    {
      id: 1,
      User: {
        name: 'Jane Doe',
        username: 'janedoe',
        profile_url: 'https://via.placeholder.com/40'
      },
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      provider: 'paypal',
      amount: 50
    },
    {
      id: 2,
      User: null, // No user provided to test default message
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      provider: 'stripe',
      amount: 120
    }
  ]
}
