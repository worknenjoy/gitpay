import type { Meta, StoryObj } from '@storybook/react'
import ExploreIssuesPrivatePage from './explore-issues-private-page'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'

const meta: Meta<typeof ExploreIssuesPrivatePage> = {
  title: 'Design Library/Pages/Private/Issues/ExploreIssues',
  component: ExploreIssuesPrivatePage,
  decorators: [withProfileTemplate],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof ExploreIssuesPrivatePage>

export const Default: Story = {
  args: {
    listTasks: () => {},
    filterTasks: () => {},
    listLabels: () => {},
    listLanguages: () => {},
    issues: {
      completed: true,
      data: [
        {
          id: 1,
          title: 'Issue 1',
          description: 'This is the first issue',
          status: 'open',
          Project: { name: 'Project 1' },
        },
      ],
    },
    labels: [],
    languages: [],
    user: {
      completed: true,
      data: {
        id: 1,
        name: 'John Doe',
        Types: [{ name: 'contributor' }],
      },
    },
  },
}
