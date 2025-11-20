import React from 'react'

import IssueOfferDrawer from './issue-offer-drawer'

export default {
  title: 'Design Library/Molecules/Drawers/IssueOfferDrawer',
  component: IssueOfferDrawer
}

const Template = (args) => <IssueOfferDrawer {...args} />

export const Default = Template.bind({})
Default.args = {
  open: true,
  assigned: false,
  onClose: () => {},
  onMessage: () => {},
  updateTask: () => {},
  offerUpdate: () => {},
  createOrder: async () => {},
  assignTask: async () => {},
  loggedUser: {
    logged: true,
    user: { id: 1, email: 'dev@example.com', customer_id: 'cus_test_123' }
  },
  assigns: [{ id: 11, userId: 1 }],
  issue: {
    completed: false,
    data: {
      id: 101,
      title: 'Fix login bug',
      description: 'Users cannot log in with OAuth on Safari.',
      status: 'open',
      User: { id: 2 },
      Offers: [
        {
          id: 1001,
          userId: 1,
          value: 150,
          suggestedDate: new Date(),
          status: 'pending',
          User: {
            id: 1,
            username: 'devuser',
            name: 'Dev User',
            picture_url: 'https://via.placeholder.com/64'
          }
        }
      ],
      metadata: {
        issue: {
          user: { login: 'maintainer', html_url: 'https://example.com/maintainer' }
        }
      }
    }
  }
}
