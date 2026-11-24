import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import IssueGithubCard from './issue-github-card'

const meta: Meta<typeof IssueGithubCard> = {
  title: 'Design Library/Molecules/Cards/IssueCards/IssueGithubCard',
  component: IssueGithubCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof IssueGithubCard>

const info = {
  status: 'open' as const,
  repoPrivate: false,
  author: { name: 'defnax' },
  assignees: [{ name: 'alexanmtz' }, { name: 'tbilous' }],
  comments: 14,
  updatedAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
  url: 'https://github.com/RetroShare/RetroShare/issues/3094'
}

const linkedPullRequests = [
  { number: 3102, title: 'Boards: stick posts to the top of the feed', state: 'merged' as const, url: 'https://github.com/RetroShare/RetroShare/pull/3102' },
  { number: 3098, title: 'Use createPostV2 in PostedCreatePostDialog', state: 'open' as const, url: 'https://github.com/RetroShare/RetroShare/pull/3098' }
]

export const WithLinkedPullRequests: Story = {
  args: { info, linkedPullRequests, linkedOpen: true }
}

export const TodayData: Story = { args: { info } }

export const PrivateRepo: Story = {
  args: { info: { ...info, repoPrivate: true, assignees: [] } }
}

export const Closed: Story = { args: { info: { ...info, status: 'closed' } } }

export const Loading: Story = { args: { info, completed: false } }
