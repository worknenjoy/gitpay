import IssuePublicPage from './issue-public-page';

const meta = {
  title: 'Design Library/Pages/Public/IssuePublicPage',
  component: IssuePublicPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta;

export const Default = {
  args: {
    loggedIn: {
      logged: false,
      completed: true,
      data: null,
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
          id: 1,
          name: 'John Doe',
          avatarUrl: 'https://via.placeholder.com/150',
        },
        Project: {
          id: 1,
          name: 'Sample Project',
          Organization: {
            id: 1,
            name: 'Sample Organization',
          },
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
    project: null,
    organization: null,
    onDeleteTask: () => {},
    updateTask: () => {},
    reportTask: () => {},
    messageAuthor: () => {},
    cleanPullRequestDataState: () => {},
    fetchAccount: () => Promise.resolve(),
    account: { completed: false, data: null },
    inviteTask: () => {},
    fundingInviteTask: () => {},
    taskSolution: null,
    getTaskSolution: () => {},
    createTaskSolution: () => {},
    updateTaskSolution: () => {},
    fetchPullRequestData: () => {},
    pullRequestData: { completed: true, data: null },
  },
};

export const loggedIn = {
  args: {
    ...Default.args,
    account: {
      completed: true,
      data: {
        id: 1,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatarUrl: 'https://via.placeholder.com/150',
      }
    },
    loggedIn: {
      logged: true,
      completed: true,
      data: {
        id: 1,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        Types: [
          {
            id: 1,
            type: 'contributor',
          },
        ],
      },
    },
  },
};

export const loading = {
  args: {
    ...Default.args,
    task: {
      completed: false,
      data: null,
      loading: true,
      error: null,
    },
  },
};

export const error = {
  args: {
    ...Default.args,
    task: {
      completed: true,
      data: null,
      loading: false,
      error: 'Failed to load issue data.',
    },
  },
};