import IssuePrivatePage from './issue-private-page';

const meta = {
  title: 'Design Library/Pages/Private/Issue/IssuePrivate',
  component: IssuePrivatePage,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

export const Default = {
  args: {
    // Supported props from IssuePrivatePage component
    loggedIn: {
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
    fundingInviteTask: () => alert('Funding Invite Task Clicked'),
    createTaskSolution: () => alert('Create Task Solution Clicked'),
    getTaskSolution: () => alert('Get Task Solution Clicked'),
    updateTaskSolution: () => alert('Update Task Solution Clicked'),
    fetchPullRequestData: () => alert('Fetch Pull Request Data Clicked'),
    pullRequestData: {
      completed: true,
      data: {}
    },
    taskSolution: null,
    createTask: () => alert('Create Task Clicked'),
    signOut: () => alert('Sign Out Clicked'),
    bottomProps: {},
    cleanPullRequestDataState: () => {},
    fetchAccount: () => {},
    inviteTask: () => alert('Invite Task Clicked'),
    messageAuthor: () => alert('Message Author Clicked'),
    onDeleteTask: () => alert('Delete Task Clicked'),
    reportTask: () => alert('Report Task Clicked'),
    onResendActivationEmail: () => alert('Resend Activation Email Clicked'),
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
    updateTask: () => alert('Update Task Clicked'),

    // New: customer/order/wallet related props
    fetchCustomer: () => alert('Fetch Customer Clicked'),
    customer: {
      completed: true,
      data: { id: 1, name: 'Jane Customer' }
    },
  addNotification: (...args: any[]) => alert(`Notification: ${args?.[0] || 'Sample notification'}`),
    createOrder: () => alert('Create Order Clicked'),
    order: {
      completed: true,
      data: { id: 101, status: 'pending', amount: 100, currency: 'USD' }
    },
    fetchWallet: () => alert('Fetch Wallet Clicked'),
    wallet: {
      completed: true,
      data: { id: 10, balance: 500, currency: 'USD' }
    },
    listWallets: () => alert('List Wallets Clicked'),
    wallets: {
      completed: true,
      data: [
        { id: 10, balance: 500, currency: 'USD' },
        { id: 11, balance: 250, currency: 'USD' }
      ]
    },
    fetchTask: () => alert('Fetch Task Clicked'),
    syncTask: () => alert('Sync Task Clicked')
  }
};