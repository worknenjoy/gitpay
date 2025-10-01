import IssuePrivatePage from './issue-private-page';

const meta = {
  title: 'Design Library/Pages/Private/IssuePages/IssuePrivatePage',
  component: IssuePrivatePage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default= {
  args: {
    loggedIn: {
      completed: true,
      data: { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' },
    },
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
          avatarUrl: 'https://via.placeholder.com/150',
        },
        project: {
          id: 1,
          name: 'Sample Project',
        },
        organization: {
          id: 1,
          name: 'Sample Organization',
        },
      },
      loading: false,
      error: null,
    },
    bottomBarProps: {
      // Add necessary props for BottomBar if any
    },
    accountMenuProps: {
      // Add necessary props for AccountMenu if any
    },
    profileHeaderProps: {
      title: 'Issue Details',
      subtitle: 'Detailed view of the selected issue',
    },
    createTask: () => alert('Create Task Clicked'),
    updateTask: () => alert('Update Task Clicked'),
    addNotification: (msg) => alert(`Notification: ${msg}`),
    openPaymentDrawer: false,
    setOpenPaymentDrawer: (open) => alert(`Set Payment Drawer Open: ${open}`),
    user: { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' },
    onDeleteTask: () => alert('Delete Task Clicked'),
    fetchTask: () => alert('Fetch Task Clicked'),
    taskLoading: false,
    taskError: null,
    project: null,
    organization: null,
    updateUser: () => alert('Update User Clicked'),
    fetchUser: () => alert('Fetch User Clicked'),
    reportTask: () => alert('Report Task Clicked'),
    messageAuthor: () => alert('Message Author Clicked'),
    invoiceTask: () => alert('Invoice Task Clicked'),
    createOrder: () => alert('Create Order Clicked'),
    assignTask: () => alert('Assign Task Clicked'),
    offerUpdate: () => alert('Offer Update Clicked'),
    messageOffer: () => alert('Message Offer Clicked'),
    assignDialog: false,
    handleAssignFundingDialogClose: () => alert('Close Assign Funding Dialog'),
    fundingInvite: {
      email: '',
      message: '',
    },
    handleFundingEmailInputChange: (e) => alert(`Funding Email Changed: ${e.target.value}`),
    handleFundingInputMessageChange: (e) => alert(`Funding Message Changed: ${e.target.value}`),
    sendFundingInvite: () => alert('Send Funding Invite Clicked'),
    currentPrice: 0,
    setCurrentPrice: (price) => alert(`Set Current Price: ${price}`),
    termsAgreed: false,
    setTermsAgreed: (agreed) => alert(`Set Terms Agreed: ${agreed}`),
    setInterestedSuggestedDate: (date) => alert(`Set Interested Suggested Date: ${date}`),
    taskFundingDialog: false,
    handleTaskFundingDialogOpen: () => alert('Open Task Funding Dialog'),
    cleanPullRequestDataState: () => alert('Clean Pull Request Data State'),
    fetchAccount: () => alert('Fetch Account Clicked'),
    onResendActivationEmail: () => alert('Resend Activation Email Clicked'),
  },
};