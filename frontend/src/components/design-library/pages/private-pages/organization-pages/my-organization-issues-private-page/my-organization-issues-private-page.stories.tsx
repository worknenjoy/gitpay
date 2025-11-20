import type { Meta, StoryObj } from '@storybook/react'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import MyOrganizationIssuesPrivatePage from './my-organization-issues-private-page'

const meta: Meta<typeof MyOrganizationIssuesPrivatePage> = {
  title: 'Design Library/Pages/Private/Organization/MyOrganizationIssues',
  component: MyOrganizationIssuesPrivatePage,
  decorators: [withProfileTemplate],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof MyOrganizationIssuesPrivatePage>

export const Default: Story = {
  args: {
    organization: {
      completed: true,
      data: {
        id: 1,
        name: 'Demo Organization',
        Projects: [
          {
            id: 1,
            name: 'Project A',
            Tasks: [
              { id: 1, title: 'Task 1', status: 'open' },
              { id: 2, title: 'Task 2', status: 'closed' },
            ],
            Organization: { id: 1, name: 'Demo Organization' },
          },
          {
            id: 2,
            name: 'Project B',
            Tasks: [
              { id: 3, title: 'Task 3', status: 'open' },
              { id: 4, title: 'Task 4', status: 'closed' },
            ],
            Organization: { id: 1, name: 'Demo Organization' },
          },
        ],
      },
    },
    user: {
      completed: true,
      data: {
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com',
        Types: [{ name: 'contributor' }, { name: 'maintainer' }],
      },
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
          createdAt: '2023-10-01T12:00:00Z',
        },
        {
          id: 2,
          title: 'Issue 2',
          description: 'Description for issue 2',
          status: 'closed',
          Project: { name: 'Project B' },
          User: { username: 'bob' },
          createdAt: '2023-10-03T12:00:00Z',
        },
      ],
    },
  },
}

export const Contributor: Story = {
  args: {
    project: {
      completed: true,
      data: {
        id: 1,
        name: 'Demo Project',
      },
    },
    user: {
      completed: true,
      data: {
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com',
        Types: [{ name: 'contributor' }],
      },
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
          createdAt: '2023-10-01T12:00:00Z',
        },
        {
          id: 2,
          title: 'Issue 2',
          description: 'Description for issue 2',
          status: 'closed',
          Project: { name: 'Project B' },
          User: { username: 'bob' },
          createdAt: '2023-10-03T12:00:00Z',
        },
      ],
    },
  },
}
