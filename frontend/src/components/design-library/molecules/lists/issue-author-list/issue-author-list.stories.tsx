import React from 'react'
import IssueAuthorList from './issue-author-list'

export default {
  title: 'Design Library/Molecules/Lists/IssueAuthorList',
  component: IssueAuthorList,
}

const Template = (args) => <IssueAuthorList {...args} />

export const Default = Template.bind({})
Default.args = {
  authors: [{ id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/150' }],
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
    messageAuthor: () => console.log('Message author clicked'),
  },
}

export const NotLogged = Template.bind({})
NotLogged.args = {
  authors: [{ id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/150' }],
  logged: false,
  user: {
    completed: true,
    data: {},
  },
  task: {
    completed: true,
    data: {},
  },
}

export const Loading = Template.bind({})
Loading.args = {
  authors: [],
  logged: false,
  user: {
    completed: false,
    data: null,
  },
  task: {
    completed: false,
    data: null,
    messageAuthor: () => console.log('Message author clicked'),
  },
}
