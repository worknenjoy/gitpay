import type { Meta, StoryObj } from '@storybook/react'
import UserProfilePublicPage from './user-profile-public-page'
import { withPublicTemplate } from '../../../../../../.storybook/decorators/withPublicTemplate'

const meta = {
  title: 'Design Library/Pages/Public/UserProfile',
  component: UserProfilePublicPage,
  decorators: [withPublicTemplate]
} satisfies Meta<typeof UserProfilePublicPage>

export default meta
type Story = StoryObj<typeof UserProfilePublicPage>

export const Default: Story = {
  args: {
    profile: {
      picture_url: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
      username: 'octocat',
      name: 'The Octocat',
      profile_url: 'https://github.com/octocat'
    },
    getUserTypes: () => Promise.resolve(['type1', 'type2']),
    tasks: {
      completed: true,
      data: [
        {
          id: 1,
          title: 'Issue 1',
          status: 'open',
          value: 100,
          created_at: '2024-01-01'
        },
        {
          id: 2,
          title: 'Issue 2',
          status: 'closed',
          value: 200,
          created_at: '2024-02-01'
        }
      ]
    },
    listTasks: () => {
      return Promise.resolve()
    }
  }
}
