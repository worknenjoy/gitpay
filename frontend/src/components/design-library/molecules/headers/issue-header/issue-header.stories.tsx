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

/** Redesign: meta block with importer, verified author, linked pull requests and Message. */
export const WithMeta = Template.bind({})
WithMeta.args = {
  user: { completed: true, data: { id: 2 } },
  updateTask: () => {},
  reportTask: () => {},
  handleDeleteTask: () => Promise.resolve({}),
  onMessage: () => {},
  linkedPullRequests: [
    {
      number: 3102,
      title: 'Boards: stick posts to the top of the feed',
      state: 'merged',
      url: 'https://github.com/RetroShare/RetroShare/pull/3102'
    },
    {
      number: 3098,
      title: 'Use createPostV2 in PostedCreatePostDialog',
      state: 'open',
      url: 'https://github.com/RetroShare/RetroShare/pull/3098'
    }
  ],
  task: {
    completed: true,
    data: {
      id: 3094,
      provider: 'github',
      url: 'https://github.com/RetroShare/RetroShare/issues/3094',
      title: '[Qt] Boards improvements (alias Reddit clone)',
      status: 'open',
      User: { id: 1, name: 'RetroShare', provider_username: 'RetroShare' },
      metadata: {
        issue: {
          state: 'open',
          html_url: 'https://github.com/RetroShare/RetroShare/issues/3094',
          user: { login: 'RetroShare', html_url: 'https://github.com/RetroShare' }
        },
        labels: [
          { id: 1, name: 'help wanted' },
          { id: 2, name: 'gui' },
          { id: 3, name: 'good first issue' }
        ]
      }
    }
  }
}
