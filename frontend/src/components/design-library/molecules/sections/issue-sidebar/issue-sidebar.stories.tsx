import React from 'react'
import IssueSidebar from './issue-sidebar'

export default {
  title: 'Design Library/Molecules/Sections/IssueSidebar',
  component: IssueSidebar
}

const Template = (args) => <IssueSidebar {...args} />

const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() // +7 days
const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // -3 days

const baseArgs = {
  user: {
    completed: true,
    data: {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      avatar_url: 'https://via.placeholder.com/64'
    }
  },
  account: {
    completed: true,
    data: {
      id: 1,
      name: 'Foo Bar'
    }
  },
  updateTask: () => {},
  inviteTask: () => {},
  fundingInviteTask: () => {},
  cleanPullRequestDataState: () => {},
  fetchAccount: () => {},
  fetchPullRequestData: () => {},
  taskSolution: null,
  getTaskSolution: () => {},
  createTaskSolution: () => {},
  updateTaskSolution: () => {},
  pullRequestData: {
    completed: true,
    data: {}
  },
  customer: {
    completed: true,
    data: {}
  },
  addNotification: () => {},
  createOrder: async () => {},
  order: {
    completed: true,
    data: {}
  },
  fetchWallet: () => {},
  wallet: {
    completed: true,
    data: {}
  },
  listWallets: () => {},
  wallets: {
    completed: true,
    data: []
  },
  fetchTask: () => {},
  syncTask: () => {},
  fetchCustomer: () => {}
}

export const AsUser = Template.bind({})
AsUser.args = {
  ...baseArgs,
  task: {
    completed: false,
    values: { available: 250 },
    data: {
      id: 101,
      title: 'Improve search performance',
      paid: false,
      private: false,
      status: 'open',
      level: 'intermediate',
      deadline: futureDate,
      Assigns: [],
      Orders: [
        {
          id: 1,
          paid: true,
          status: 'succeeded',
          amount: 100,
          provider: 'stripe',
          updatedAt: new Date().toISOString(),
          User: { name: 'Alice', username: 'alice' }
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

export const AsOwner = Template.bind({})
AsOwner.args = {
  ...baseArgs,
  task: {
    completed: false,
    values: { available: 500 },
    data: {
      id: 202,
      title: 'Refactor authentication module',
      paid: true,
      private: true,
      status: 'in_progress',
      level: 'advanced',
      deadline: futureDate,
      Assigns: [{ id: 11, userId: 1 }],
      Orders: [
        {
          id: 2,
          paid: true,
          status: 'succeeded',
          amount: 250,
          provider: 'paypal',
          updatedAt: new Date().toISOString(),
          User: { name: 'Bob', username: 'bob' }
        }
      ],
      metadata: {
        issue: {
          user: { login: 'owner', html_url: 'https://example.com/owner' }
        }
      }
    }
  }
}

export const Overdue = Template.bind({})
Overdue.args = {
  ...baseArgs,
  task: {
    completed: false,
    values: { available: 0 },
    data: {
      id: 303,
      title: 'Fix flaky tests',
      paid: false,
      private: false,
      status: 'open',
      level: 'beginner',
      deadline: pastDate,
      Assigns: [],
      Orders: [],
      metadata: {
        issue: {
          user: { login: 'qa', html_url: 'https://example.com/qa' }
        }
      }
    }
  }
}
