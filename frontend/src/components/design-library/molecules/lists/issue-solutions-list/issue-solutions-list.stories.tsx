import type { Meta, StoryObj } from '@storybook/react'
import IssueSolutionsList from './issue-solutions-list'

const meta: Meta<typeof IssueSolutionsList> = {
  title: 'Design Library/Molecules/Lists/IssueSolutionsList',
  component: IssueSolutionsList,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof IssueSolutionsList>

export const Several: Story = {
  args: {
    solutions: [
      {
        id: 1,
        author: { name: 'alexanmtz' },
        pullRequest: {
          number: 3102,
          title: 'Boards: stick posts to the top of the feed',
          url: 'https://github.com/RetroShare/RetroShare/pull/3102',
          state: 'merged'
        },
        sentAt: '2026-11-21',
        payout: 'ready'
      },
      {
        id: 2,
        author: { name: 'tbilous' },
        pullRequest: {
          number: 3098,
          title: 'Use createPostV2 in PostedCreatePostDialog',
          url: 'https://github.com/RetroShare/RetroShare/pull/3098',
          state: 'open'
        },
        sentAt: '2026-11-16',
        payout: 'waiting'
      },
      {
        id: 3,
        author: { name: 'mkaruza' },
        pullRequest: {
          number: 3071,
          title: 'Pinned posts for boards (draft)',
          url: 'https://github.com/RetroShare/RetroShare/pull/3071',
          state: 'closed'
        },
        sentAt: '2026-10-30',
        payout: 'none'
      }
    ]
  }
}

export const TodayData: Story = {
  args: {
    solutions: [
      {
        id: 1,
        author: { name: 'alexanmtz' },
        pullRequest: {
          title: 'https://github.com/RetroShare/RetroShare/pull/3102',
          url: 'https://github.com/RetroShare/RetroShare/pull/3102',
          state: 'open'
        }
      }
    ]
  }
}

export const Empty: Story = { args: { solutions: [], onSendSolution: () => {} } }
