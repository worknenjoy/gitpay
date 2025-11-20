import React from 'react'
import IssueHeader from './issue-header'

export default {
  title: 'Design Library/Molecules/Headers/IssueHeader',
  component: IssueHeader,
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    status: { control: 'text' }
  }
}

const Template = (args) => <IssueHeader {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Issue Title Example',
  subtitle: 'This is a subtitle for the issue',
  status: 'Open',
  project: {
    completed: true,
    data: {
      name: 'Project Name'
    }
  },
  organization: {
    completed: true,
    data: {
      name: 'Organization Name'
    }
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
  }
}

export const Loading = Template.bind({})
Loading.args = {
  title: 'Loading...',
  subtitle: 'Loading subtitle...',
  status: 'Loading...',
  project: {
    completed: false,
    data: {}
  },
  organization: {
    completed: false,
    data: {}
  },
  task: {
    completed: false,
    data: {}
  }
}
