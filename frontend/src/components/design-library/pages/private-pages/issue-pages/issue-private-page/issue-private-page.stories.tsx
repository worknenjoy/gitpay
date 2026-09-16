import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import IssuePrivatePage from './issue-private-page'

const meta = {
  title: 'Design Library/Pages/Private/Issue/IssuePrivate',
  component: IssuePrivatePage,
  decorators: [withProfileTemplate],
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta

export const Default = {
  args: {
    user: {
      logged: true,
      completed: true,
      data: {
        id: 1,
        email: 'jane.doe@example.com',
        name: 'Jane Doe',
        Types: [{ id: 1, name: 'contributor' }],
        Project: {
          id: 1,
          name: 'Sample Project',
          Organization: { id: 1, name: 'Sample Org' }
        }
      }
    },
    account: {
      completed: true,
      data: { id: 1, balance: 1000 }
    },
    // New: top-level project and organization props
    project: {
      completed: true,
      data: { id: 1, name: 'Sample Project' }
    },
    organization: {
      completed: true,
      data: { id: 1, name: 'Sample Organization' }
    },
    fundingInviteTask: () => console.error('Funding Invite Task Clicked'),
    createTaskSolution: () => console.error('Create Task Solution Clicked'),
    getTaskSolution: () => console.error('Get Task Solution Clicked'),
    updateTaskSolution: () => console.error('Update Task Solution Clicked'),
    fetchPullRequestData: () => console.error('Fetch Pull Request Data Clicked'),
    pullRequestData: {
      completed: true,
      data: {}
    },
    taskSolution: null,
    createTask: () => console.error('Create Task Clicked'),
    signOut: () => console.error('Sign Out Clicked'),
    bottomProps: {},
    cleanPullRequestDataState: () => {},
    fetchAccount: () => {},
    inviteTask: () => console.error('Invite Task Clicked'),
    messageAuthor: () => console.error('Message Author Clicked'),
    onDeleteTask: () => console.error('Delete Task Clicked'),
    reportTask: () => console.error('Report Task Clicked'),
    task: {
      completed: true,
      data: {
        id: 1,
        title: 'Sample Issue Title',
        description: 'This is a sample description for the issue.',
        status: 'open',
        price: 100,
        currency: 'USD',
        user: {
          id: 2,
          name: 'John Doe',
          avatarUrl: 'https://via.placeholder.com/150'
        },
        Project: {
          id: 1,
          name: 'Sample Project',
          Organization: {
            id: 1,
            name: 'Sample Organization'
          }
        }
      },
      loading: false,
      error: null
    },
    updateTask: () => console.error('Update Task Clicked'),

    // New: customer/order/wallet related props
    fetchCustomer: () => console.error('Fetch Customer Clicked'),
    customer: {
      completed: true,
      data: { id: 1, name: 'Jane Customer' }
    },
    addNotification: (...args: any[]) =>
      console.error(`Notification: ${args?.[0] || 'Sample notification'}`),
    createOrder: () => console.error('Create Order Clicked'),
    order: {
      completed: true,
      data: { id: 101, status: 'pending', amount: 100, currency: 'USD' }
    },
    fetchWallet: () => console.error('Fetch Wallet Clicked'),
    wallet: {
      completed: true,
      data: { id: 10, balance: 500, currency: 'USD' }
    },
    listWallets: () => console.error('List Wallets Clicked'),
    wallets: {
      completed: true,
      data: [
        { id: 10, balance: 500, currency: 'USD' },
        { id: 11, balance: 250, currency: 'USD' }
      ]
    },
    fetchTask: () => console.error('Fetch Task Clicked'),
    syncTask: () => console.error('Sync Task Clicked')
  }
}
