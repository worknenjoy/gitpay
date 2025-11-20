import type { Meta, StoryObj } from '@storybook/react'
import MyProjectIssuesPrivatePage from './my-project-issues-private-page'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import MyIssuesPrivatePage from '../../issues-pages/my-issues-private-page/my-issues-private-page'

const meta: Meta<typeof MyProjectIssuesPrivatePage> = {
  title: 'Design Library/Pages/Private/Project/MyProjectIssues',
  component: MyProjectIssuesPrivatePage,
  decorators: [withProfileTemplate],
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta

type Story = StoryObj<typeof MyIssuesPrivatePage>

export const Default: Story = {
  args: {
    project: {
      completed: true,
      data: {
        id: 1,
        name: 'Demo Project',
        Organization: { id: 1, name: 'Demo Organization' }
      }
    },
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
    project: {
      completed: true,
      data: {
        id: 1,
        name: 'Demo Project'
      }
    },
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
