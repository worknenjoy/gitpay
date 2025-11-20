import type { Meta } from '@storybook/react'
import OrganizationPublicPage from './organization-public-page'
import { withPublicTemplate } from '../../../../../../.storybook/decorators/withPublicTemplate'

const meta: Meta<typeof OrganizationPublicPage> = {
  title: 'Design Library/Pages/Public/Organization',
  component: OrganizationPublicPage,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [withPublicTemplate]
}

export default meta

export const Default = {
  args: {
    organization: {
      completed: true,
      data: {
        id: '1',
        name: 'Organization Sample',
        Projects: [
          {
            id: '1',
            name: 'Project Sample',
            Organization: { name: 'Organization Sample', provider: 'GitHub' },
            Tasks: [
              { status: 'open', value: 50 },
              { status: 'closed', value: 0 }
            ]
          }
        ]
      }
    },
    issues: {
      completed: true,
      data: [
        {
          id: '1',
          title: 'Issue 1',
          status: 'open',
          createdAt: '2024-01-01',
          url: 'https://example.com/issue/1',
          Project: {
            id: '1',
            name: 'Project Sample'
          }
        }
      ]
    }
  }
}
