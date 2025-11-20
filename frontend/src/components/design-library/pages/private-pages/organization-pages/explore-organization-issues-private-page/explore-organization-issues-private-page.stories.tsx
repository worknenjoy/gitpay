import { Meta, StoryObj } from '@storybook/react'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import ExploreOrganizationPage from './explore-organization-issues-private-page'

const meta: Meta<typeof ExploreOrganizationPage> = {
  title: 'Design Library/Pages/Private/Organization/Explore',
  component: ExploreOrganizationPage,
  decorators: [withProfileTemplate],
}

export default meta

type Story = StoryObj<typeof ExploreOrganizationPage>

export const Default: Story = {
  args: {
    organization: {
      completed: true,
      data: {
        id: '1',
        name: 'Organization Sample',
        Projects: [
          {
            id: '1',
            name: 'Demo Project 1',
            Organization: { name: 'Organization Sample', provider: 'GitHub' },
            Tasks: [
              { id: '1', status: 'open', value: 50 },
              { id: '2', status: 'closed', value: 0 },
            ],
          },
        ],
        User: {
          id: '1',
          name: 'Demo User',
          email: 'demo.user@example.com',
        },
      },
    },
    issues: {
      completed: true,
      data: [
        { id: '1', title: 'Issue 1', status: 'open', Project: { id: '1', name: 'Demo Project' } },
        { id: '2', title: 'Issue 2', status: 'closed', Project: { id: '1', name: 'Demo Project' } },
      ],
    },
    labels: [],
    languages: [],
    filterTasks: () => {},
    listTasks: () => {},
    listLabels: () => {},
    listLanguages: () => {},
    user: {
      completed: true,
      data: {
        id: '1',
        name: 'Demo User',
        email: 'demo.user@example.com',
        Types: [{ id: '1', name: 'contributor' }],
      },
    },
  },
}
