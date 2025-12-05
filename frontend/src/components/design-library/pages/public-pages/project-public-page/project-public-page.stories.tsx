import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import ProjectPublicPage from './project-public-page'
import { withPublicTemplate } from '../../../../../../.storybook/decorators/withPublicTemplate'

const meta: Meta<typeof ProjectPublicPage> = {
  title: 'Design Library/Pages/Public/Project',
  component: ProjectPublicPage,
  decorators: [withPublicTemplate],
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta

type Story = StoryObj<typeof ProjectPublicPage>

export const Default: Story = {
  render: (args) => <ProjectPublicPage {...(args as any)} />,
  args: {
    project: {
      completed: true,
      data: {
        id: '1',
        name: 'Project Name',
        Organization: {
          name: 'Organization Name'
        }
      }
    },
    issues: {
      completed: true,
      data: [
        {
          id: '1',
          provider: 'github',
          url: 'https://github.com/example/repo/issues/1',
          title: 'Issue 1',
          status: 'open',
          value: 50,
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          provider: 'github',
          url: 'https://github.com/example/repo/issues/2',
          title: 'Issue 2',
          status: 'closed',
          createdAt: '2024-01-02'
        }
      ]
    }
  }
}
