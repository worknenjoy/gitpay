import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button, Typography } from '@mui/material'
import IssueSidebarCardBase from './issue-sidebar-card-base'

const meta: Meta<typeof IssueSidebarCardBase> = {
  title: 'Design Library/Molecules/Cards/IssueCards/IssueSidebarCardBase',
  component: IssueSidebarCardBase,
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
type Story = StoryObj<typeof IssueSidebarCardBase>

export const Default: Story = {
  args: {
    caption: 'Bounty',
    children: <Typography variant="body2">Card body goes here.</Typography>
  }
}

export const WithHeaderLink: Story = {
  args: {
    ...Default.args,
    headerAction: { label: 'View breakdown', onClick: () => {} }
  }
}

export const WithIconAndFooter: Story = {
  args: {
    caption: 'GitHub',
    captionIcon: (
      <img src="https://github.githubassets.com/favicons/favicon.svg" alt="" width={14} />
    ),
    headerAction: { label: 'View on GitHub', href: 'https://github.com' },
    children: (
      <Button variant="contained" color="primary" fullWidth>
        Primary action
      </Button>
    ),
    footer: 'For maintainers and sponsors. Paid out when a solution is merged.'
  }
}

export const Loading: Story = {
  args: { ...Default.args, completed: false }
}
