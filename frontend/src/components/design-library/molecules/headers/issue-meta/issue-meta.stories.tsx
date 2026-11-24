import type { Meta, StoryObj } from '@storybook/react'
import IssueMeta from './issue-meta'

const meta: Meta<typeof IssueMeta> = {
  title: 'Design Library/Molecules/Headers/IssueMeta',
  component: IssueMeta,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof IssueMeta>

const linkedPullRequests = [
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

export const ImportedByAuthor: Story = {
  args: {
    provider: 'github',
    providerUrl: 'https://github.com/RetroShare/RetroShare/issues/3094',
    status: 'open',
    author: { name: 'RetroShare' },
    importer: { name: 'RetroShare' },
    importerIsAuthor: true,
    linkedPullRequests,
    onMessage: () => {}
  }
}

export const ImportedByNonAuthor: Story = {
  args: {
    ...ImportedByAuthor.args,
    author: { name: 'defnax', url: 'https://github.com/defnax' },
    importerIsAuthor: false
  }
}

export const TodayData: Story = {
  args: {
    provider: 'github',
    providerUrl: 'https://github.com/RetroShare/RetroShare/issues/3094',
    status: 'open',
    author: { name: 'defnax', url: 'https://github.com/defnax' },
    importer: { name: 'RetroShare' },
    onMessage: () => {}
  }
}

export const LinkedMenuOpen: Story = {
  args: { ...ImportedByAuthor.args, linkedOpen: true }
}

export const Closed: Story = {
  args: { ...TodayData.args, status: 'closed' }
}
