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
    fundingInviteTask: () => console.log('Funding Invite Task Clicked'),
    createTaskSolution: () => console.log('Create Task Solution Clicked'),
    getTaskSolution: () => console.log('Get Task Solution Clicked'),
    updateTaskSolution: () => console.log('Update Task Solution Clicked'),
    fetchPullRequestData: () => console.log('Fetch Pull Request Data Clicked'),
    pullRequestData: {
      completed: true,
      data: {}
    },
    taskSolution: null,
    createTask: () => console.log('Create Task Clicked'),
    signOut: () => console.log('Sign Out Clicked'),
    bottomProps: {},
    cleanPullRequestDataState: () => {},
    fetchAccount: () => {},
    inviteTask: () => console.log('Invite Task Clicked'),
    messageAuthor: () => console.log('Message Author Clicked'),
    onDeleteTask: () => console.log('Delete Task Clicked'),
    reportTask: () => console.log('Report Task Clicked'),
    onResendActivationEmail: () => console.log('Resend Activation Email Clicked'),
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
    updateTask: () => console.log('Update Task Clicked'),

    // New: customer/order/wallet related props
    fetchCustomer: () => console.log('Fetch Customer Clicked'),
    customer: {
      completed: true,
      data: { id: 1, name: 'Jane Customer' }
    },
    addNotification: (...args: any[]) =>
      console.log(`Notification: ${args?.[0] || 'Sample notification'}`),
    createOrder: () => console.log('Create Order Clicked'),
    order: {
      completed: true,
      data: { id: 101, status: 'pending', amount: 100, currency: 'USD' }
    },
    fetchWallet: () => console.log('Fetch Wallet Clicked'),
    wallet: {
      completed: true,
      data: { id: 10, balance: 500, currency: 'USD' }
    },
    listWallets: () => console.log('List Wallets Clicked'),
    wallets: {
      completed: true,
      data: [
        { id: 10, balance: 500, currency: 'USD' },
        { id: 11, balance: 250, currency: 'USD' }
      ]
    },
    fetchTask: () => console.log('Fetch Task Clicked'),
    syncTask: () => console.log('Sync Task Clicked')
  }
}
