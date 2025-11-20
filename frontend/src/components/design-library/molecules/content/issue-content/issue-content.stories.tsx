import React from 'react'
import IssueContent from './issue-content'

export default {
  title: 'Design Library/Molecules/Content/IssueContent',
  component: IssueContent,
}

const Template = (args) => <IssueContent {...args} />

export const Default = Template.bind({})
Default.args = {
  logged: true,
  user: {
    completed: true,
    data: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150',
    },
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
            avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
          },
        },
        labels: [
          { id: 1, name: 'bug', color: '#d73a4a' },
          { id: 2, name: 'enhancement', color: '#a2eeef' },
          { id: 3, name: 'documentation', color: '#0075ca' },
        ],
      },
    },
  },
  organization: {
    completed: true,
    data: {
      name: 'Organization Name',
    },
  },
  project: {
    completed: true,
    data: {
      name: 'Project Name',
    },
  },
  updateTask: () => console.log('Task updated'),
  reportTask: () => console.log('Task reported'),
}

export const Loading = Template.bind({})
Loading.args = {
  logged: true,
  user: {
    completed: false,
    data: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150',
    },
  },
  task: {
    completed: false,
    data: {},
  },
}
