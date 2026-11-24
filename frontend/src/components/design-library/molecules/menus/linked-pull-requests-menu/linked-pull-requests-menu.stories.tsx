import type { Meta, StoryObj } from '@storybook/react'
import LinkedPullRequestsMenu from './linked-pull-requests-menu'

const meta: Meta<typeof LinkedPullRequestsMenu> = {
  title: 'Design Library/Molecules/Menus/LinkedPullRequestsMenu',
  component: LinkedPullRequestsMenu,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof LinkedPullRequestsMenu>

const pullRequests = [
  {
    number: 3102,
    title: 'Boards: stick posts to the top of the feed',
    state: 'merged' as const,
    url: 'https://github.com/RetroShare/RetroShare/pull/3102'
  },
  {
    number: 3098,
    title: 'Use createPostV2 in PostedCreatePostDialog',
    state: 'open' as const,
    url: 'https://github.com/RetroShare/RetroShare/pull/3098'
  }
]

export const Single: Story = { args: { pullRequests: pullRequests.slice(1) } }
export const Several: Story = { args: { pullRequests } }
export const Open: Story = { args: { pullRequests, defaultOpen: true } }
export const None: Story = { args: { pullRequests: [] } }
