import React from 'react';
import IssuePage from './issue-page';

const meta = {
  title: 'Design Library/Organisms/Layout/IssuePage',
  component: IssuePage,
  parameters: { layout: 'fullscreen' }
};

export default meta;

const Template = (args) => <IssuePage {...args} />;

export const Default = Template.bind({});
Default.args = {
  logged: { data: { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/150' } },
  user: {
    completed: true,
    data: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150'
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
  project: { name: 'Project Name' },
  organization: { name: 'Organization Name' },
  updateTask: () => console.log('Task updated'),
  reportTask: () => console.log('Task reported'),
  messageAuthor: () => {},
  onDeleteTask: () => console.log('Task deleted'),
  inviteTask: () => console.log('Task invited'),
  fundingInviteTask: () => console.log('Funding invite task'),
  cleanPullRequestDataState: () => console.log('Cleaned pull request data state'),
  fetchAccount: () => console.log('Fetched account data'),
  account: { completed: true, data: { id: 1, balance: 500 } },
  taskSolution: null,
  getTaskSolution: () => console.log('Get task solution'),
  createTaskSolution: () => console.log('Create task solution'),
  updateTaskSolution: () => console.log('Update task solution'),
  fetchPullRequestData: () => console.log('Fetch pull request data'),
  pullRequestData: { completed: true, data: null }
};