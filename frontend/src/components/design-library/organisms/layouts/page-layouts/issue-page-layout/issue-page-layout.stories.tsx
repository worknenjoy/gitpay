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
  updateTask: () => console.log('Task updated'),
  reportTask: () => console.log('Task reported'),
  messageAuthor: () => {},
  onDeleteTask: () => console.log('Task deleted'),
  inviteTask: () => console.log('Task invited'),
  fundingInviteTask: () => console.log('Funding invite task'),
  cleanPullRequestDataState: () => console.log('Cleaned pull request data state'),
  fetchAccount: () => console.log('Fetched account data'),
  taskSolution: {
    completed: true,
    data: {}
  },
  customer: { completed: true, data: {} },
  addNotification: () => console.log('Notification added'),
  createOrder: async () => console.log('Order created'),
  order: { completed: true, data: {} },
  fetchWallet: () => console.log('Fetch wallet'),
  wallet: { completed: true, data: {} },
  listWallets: () => console.log('List wallets'),
  wallets: { completed: true, data: [] },
  fetchTask: () => console.log('Fetch task'),
  syncTask: () => console.log('Sync task'),
  fetchCustomer: () => console.log('Fetch customer'),
  getTaskSolution: () => console.log('Get task solution'),
  createTaskSolution: () => console.log('Create task solution'),
  updateTaskSolution: () => console.log('Update task solution'),
  fetchPullRequestData: () => console.log('Fetch pull request data'),
  pullRequestData: { completed: true, data: null }
}
