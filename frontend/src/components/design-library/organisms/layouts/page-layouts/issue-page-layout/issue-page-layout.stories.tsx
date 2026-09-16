import React from 'react'
import IssuePage from './issue-page-layout'

const meta = {
  title: 'Design Library/Organisms/Layouts/IssuePage/IssuePage',
  component: IssuePage,
  parameters: { layout: 'fullscreen' }
}

export default meta

const Template = (args) => <IssuePage {...args} />

export const Default = Template.bind({})
Default.args = {
  logged: {
    completed: true,
    data: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150'
    },
    Project: {
      id: 1,
      name: 'Sample Project',
      Organization: { id: 1, name: 'Sample Org' }
    }
  },
  task: {
    completed: true,
    data: {
      id: 1,
      provider: 'github',
      title: 'Sample Issue',
      description: 'This is a sample issue description.',
      metadata: {
        issue: {
          user: {
            login: 'octocat',
            avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
          }
        },
        labels: [
          { id: 1, name: 'bug', color: '#d73a4a' },
          { id: 2, name: 'enhancement', color: '#a2eeef' },
          { id: 3, name: 'documentation', color: '#0075ca' }
        ]
      }
    }
  },
  account: {
    completed: true,
    data: { id: 1, balance: 1000 }
  },
  updateTask: () => console.error('Task updated'),
  reportTask: () => console.error('Task reported'),
  messageAuthor: () => {},
  onDeleteTask: () => console.error('Task deleted'),
  inviteTask: () => console.error('Task invited'),
  fundingInviteTask: () => console.error('Funding invite task'),
  cleanPullRequestDataState: () => console.error('Cleaned pull request data state'),
  fetchAccount: () => console.error('Fetched account data'),
  taskSolution: {
    completed: true,
    data: {}
  },
  customer: { completed: true, data: {} },
  addNotification: () => console.error('Notification added'),
  createOrder: async () => console.error('Order created'),
  order: { completed: true, data: {} },
  fetchWallet: () => console.error('Fetch wallet'),
  wallet: { completed: true, data: {} },
  listWallets: () => console.error('List wallets'),
  wallets: { completed: true, data: [] },
  fetchTask: () => console.error('Fetch task'),
  syncTask: () => console.error('Sync task'),
  fetchCustomer: () => console.error('Fetch customer'),
  getTaskSolution: () => console.error('Get task solution'),
  createTaskSolution: () => console.error('Create task solution'),
  updateTaskSolution: () => console.error('Update task solution'),
  fetchPullRequestData: () => console.error('Fetch pull request data'),
  pullRequestData: { completed: true, data: null }
}

export const Loading = Template.bind({})
Loading.args = {
  ...Default.args,
  logged: { completed: false, data: {} },
  task: { completed: false, data: {} },
  account: { completed: false, data: {} },
  customer: { completed: false, data: {} },
  wallet: { completed: false, data: {} },
  wallets: { completed: false, data: {} },
  pullRequestData: { completed: false, data: {} }
}

export const Error = Template.bind({})
Error.args = {
  ...Default.args,
  task: { completed: true, error: 'Failed to load task data', data: {} }
}
