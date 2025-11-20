import type { Meta, StoryObj } from '@storybook/react'
import IssuePublicStatus from './issue-public-status'

const meta: Meta<typeof IssuePublicStatus> = {
  title: 'Design Library/Atoms/Status/Issue/IssuePublicStatus',
  component: IssuePublicStatus,
  parameters: {
    layout: 'centered'
  }
}

export default meta

type Story = StoryObj<typeof IssuePublicStatus>

export const Default: Story = {
  args: {
    status: 'public'
  }
}

export const Private: Story = {
  args: {
    status: 'private'
  }
}
