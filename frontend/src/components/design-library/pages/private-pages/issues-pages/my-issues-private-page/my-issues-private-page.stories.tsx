import type { Meta, StoryObj } from '@storybook/react'
import MyIssuesPrivatePage from './my-issues-private-page'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'

const meta: Meta<typeof MyIssuesPrivatePage> = {
  title: 'Design Library/Pages/Private/Issues/MyIssues',
  component: MyIssuesPrivatePage,
  decorators: [withProfileTemplate],
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta

type Story = StoryObj<typeof MyIssuesPrivatePage>

export const Default: Story = {
  args: {
    user: {
      completed: true,
      data: {
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com',
        Types: [{ name: 'contributor' }, { name: 'maintainer' }]
      }
    },
    issues: {
      completed: true,
      data: [
        {
          id: 1,
          title: 'Issue 1',
          description: 'Description for issue 1',
          status: 'open',
          Project: { name: 'Project A' },
          User: { username: 'alice' },
          createdAt: '2023-10-01T12:00:00Z'
        },
        {
          id: 2,
          title: 'Issue 2',
          description: 'Description for issue 2',
          status: 'closed',
          Project: { name: 'Project B' },
          User: { username: 'bob' },
          createdAt: '2023-10-03T12:00:00Z'
        }
      ]
    }
  }
}

export const Contributor: Story = {
  args: {
    user: {
      completed: true,
      data: {
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com',
        Types: [{ name: 'contributor' }]
      }
    },
    issues: {
      completed: true,
      data: [
        {
          id: 1,
          title: 'Issue 1',
          description: 'Description for issue 1',
          status: 'open',
          Project: { name: 'Project A' },
          User: { username: 'alice' },
          createdAt: '2023-10-01T12:00:00Z'
        },
        {
          id: 2,
          title: 'Issue 2',
          description: 'Description for issue 2',
          status: 'closed',
          Project: { name: 'Project B' },
          User: { username: 'bob' },
          createdAt: '2023-10-03T12:00:00Z'
        }
      ]
    }
  }
}
