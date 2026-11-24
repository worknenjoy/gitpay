import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import IssueSolutionsDrawer from './issue-solutions-drawer'

const meta: Meta<typeof IssueSolutionsDrawer> = {
  title: 'Design Library/Molecules/Drawers/IssueSolutionsDrawer',
  component: IssueSolutionsDrawer,
  parameters: { layout: 'fullscreen' },
  args: { open: true, onClose: () => {} }
}

export default meta
type Story = StoryObj<typeof IssueSolutionsDrawer>

export const SolutionsSent: Story = {
  args: {
    solutions: [
      { id: 1, author: { name: 'alexanmtz' }, pullRequest: { number: 3102, title: 'Boards: stick posts to the top of the feed', url: 'https://github.com/RetroShare/RetroShare/pull/3102', state: 'merged' }, sentAt: '2026-11-21', payout: 'ready' },
      { id: 2, author: { name: 'tbilous' }, pullRequest: { number: 3098, title: 'Use createPostV2 in PostedCreatePostDialog', url: 'https://github.com/RetroShare/RetroShare/pull/3098', state: 'open' }, sentAt: '2026-11-16', payout: 'waiting' }
    ]
  }
}

export const NoSolutions: Story = {
  args: { solutions: [], onSendSolution: () => {} }
}
