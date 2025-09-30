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
      },
      Project: { name: 'Project Name' },
      Organization: { name: 'Organization Name' }
    }
  },
  updateTask: () => console.log('Task updated'),
  reportTask: () => console.log('Task reported'),
  messageAuthor: () => {}
};