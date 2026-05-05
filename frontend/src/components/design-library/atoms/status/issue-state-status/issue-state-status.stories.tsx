import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import IssueStateStatus from './issue-state-status'

const meta: Meta<typeof IssueStateStatus> = {
  title: 'Design Library/Atoms/Status/IssueStateStatus',
  component: IssueStateStatus,
  args: {
    completed: true
  }
}

export default meta

type Story = StoryObj<typeof IssueStateStatus>

export const Created: Story = {
  args: {
    state: 'created',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
  }
}

export const Funded: Story = {
  args: {
    state: 'funded',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  }
}

export const Claimed: Story = {
  args: {
    state: 'claimed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  }
}

export const Completed: Story = {
  args: {
    state: 'completed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
  }
}

export const WithoutDate: Story = {
  args: {
    state: 'funded'
  }
}

export const Loading: Story = {
  args: {
    state: 'claimed',
    completed: false
  }
}
