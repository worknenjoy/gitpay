import { Meta, StoryObj } from '@storybook/react'
import ExploreProjectPage from './explore-project-issues-private-page'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'

const meta: Meta<typeof ExploreProjectPage> = {
  title: 'Design Library/Pages/Private/Project/Explore',
  component: ExploreProjectPage,
  decorators: [withProfileTemplate],
}

export default meta

type Story = StoryObj<typeof ExploreProjectPage>

export const Default: Story = {
  args: {
    project: {
      completed: true,
      data: {
        id: '1',
        name: 'Demo Project',
        Organization: { id: '1', name: 'Demo Organization' },
      },
    },
    issues: {
      completed: true,
      data: [
        { id: '1', title: 'Issue 1', status: 'open' },
        { id: '2', title: 'Issue 2', status: 'closed' },
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
