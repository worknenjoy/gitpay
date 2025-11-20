import type { Meta, StoryObj } from '@storybook/react'
import ExplorerIssuePublicPage from './explorer-issue-public-page'
import {
  withPublicTemplate,
  withPublicExplorerTemplate
} from '../../../../../../../.storybook/decorators/withPublicTemplate'

const meta = {
  title: 'Design Library/Pages/Public/Explorer/Issue',
  component: ExplorerIssuePublicPage,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [withPublicExplorerTemplate, withPublicTemplate]
} satisfies Meta<typeof ExplorerIssuePublicPage>

export default meta

type Story = StoryObj<typeof ExplorerIssuePublicPage>

export const Default: Story = {
  args: {
    // Add prop mocks here if the component expects any
    filterTasks: () => {},
    filteredTasks: [],
    listTasks: () => {},
    issues: {
      completed: true,
      data: [
        {
          id: 1,
          title: 'Sample Issue 1',
          description: 'This is a sample issue description.',
          status: 'open',
          labels: ['bug', 'frontend']
        }
      ]
    },
    labels: {
      completed: true,
      data: [
        { id: 1, name: 'bug' },
        { id: 2, name: 'feature' }
      ]
    },
    languages: {
      completed: true,
      data: [
        { id: 1, name: 'JavaScript' },
        { id: 2, name: 'Python' }
      ]
    },
    listLabels: () => {},
    listLanguages: () => {}
  }
}
