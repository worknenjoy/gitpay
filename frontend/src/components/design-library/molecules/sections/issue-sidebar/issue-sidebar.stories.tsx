import React from 'react'
import IssueSidebar from './issue-sidebar'

export default {
  title: 'Design Library/Molecules/Sections/IssueSidebar',
  component: IssueSidebar
}

const Template = (args) => <IssueSidebar {...args} />

const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() // +7 days
const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // -3 days
const fundedAt = new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
const claimedAt = new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
const completedAt = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago

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
    completed: true,
    values: { available: 250 },
    data: {
      id: 101,
      title: 'Improve search performance',
      state: 'funded',
      funded_at: fundedAt,
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
    completed: true,
    values: { available: 500 },
    data: {
      id: 202,
      title: 'Refactor authentication module',
      state: 'claimed',
      claimed_at: claimedAt,
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
    completed: true,
    values: { available: 0 },
    data: {
      id: 303,
      title: 'Fix flaky tests',
      state: 'created',
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

export const StateCreated = Template.bind({})
StateCreated.args = {
  ...baseArgs,
  task: {
    completed: true,
    values: { available: 0 },
    data: {
      id: 401,
      title: 'Add new onboarding flow',
      state: 'created',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      paid: false,
      private: false,
      status: 'open',
      level: 'beginner',
      deadline: futureDate,
      Assigns: [],
      Orders: [],
      metadata: {
        issue: {
          user: { login: 'dev', html_url: 'https://example.com/dev' }
        }
      }
    }
  }
}

export const StateFunded = Template.bind({})
StateFunded.args = {
  ...baseArgs,
  task: {
    completed: true,
    values: { available: 150 },
    data: {
      id: 404,
      title: 'Add dark mode support',
      state: 'funded',
      funded_at: fundedAt,
      paid: false,
      private: false,
      status: 'open',
      level: 'intermediate',
      deadline: futureDate,
      Assigns: [],
      Orders: [],
      metadata: {
        issue: {
          user: { login: 'alice', html_url: 'https://example.com/alice' }
        }
      }
    }
  }
}

export const StateClaimed = Template.bind({})
StateClaimed.args = {
  ...baseArgs,
  task: {
    completed: true,
    values: { available: 300 },
    data: {
      id: 505,
      title: 'Fix memory leak in worker process',
      state: 'claimed',
      claimed_at: claimedAt,
      paid: false,
      private: false,
      status: 'in_progress',
      level: 'advanced',
      deadline: futureDate,
      Assigns: [{ id: 22, userId: 2 }],
      Orders: [],
      metadata: {
        issue: {
          user: { login: 'bob', html_url: 'https://example.com/bob' }
        }
      }
    }
  }
}

export const StateCompleted = Template.bind({})
StateCompleted.args = {
  ...baseArgs,
  task: {
    completed: true,
    values: { available: 0 },
    data: {
      id: 606,
      title: 'Migrate to TypeScript',
      state: 'completed',
      completed_at: completedAt,
      paid: true,
      private: false,
      status: 'closed',
      level: 'advanced',
      deadline: pastDate,
      Assigns: [{ id: 33, userId: 3 }],
      Orders: [],
      metadata: {
        issue: {
          user: { login: 'carol', html_url: 'https://example.com/carol' }
        }
      }
    }
  }
}

export const Loading = Template.bind({})
Loading.args = {
  ...baseArgs,
  task: {
    completed: false,
    data: {}
  },
  user: { completed: false, data: {} },
  account: { completed: false, data: {} }
}
