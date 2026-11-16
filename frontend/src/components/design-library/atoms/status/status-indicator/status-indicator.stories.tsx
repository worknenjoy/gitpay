import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Box } from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import StatusIndicator from './status-indicator'

const meta: Meta<typeof StatusIndicator> = {
  title: 'Design Library/Atoms/Status/StatusIndicator',
  component: StatusIndicator,
  parameters: {
    layout: 'centered'
  },
  args: {
    label: 'Connected',
    tone: 'success'
  }
}

export default meta
type Story = StoryObj<typeof StatusIndicator>

export const Success: Story = {
  args: { label: 'Connected', tone: 'success' }
}

export const Warning: Story = {
  args: { label: 'Action required', tone: 'warning' }
}

export const Error: Story = {
  args: { label: 'Disconnected', tone: 'error' }
}

export const Info: Story = {
  args: { label: 'Under review', tone: 'info' }
}

export const Neutral: Story = {
  args: { label: 'Disabled', tone: 'neutral' }
}

export const WithAction: Story = {
  args: {
    label: (
      <>
        Sync · <b>Every hour</b>
      </>
    ),
    tone: 'success',
    action: { label: 'Change', icon: <TuneIcon />, onClick: () => {} }
  }
}

export const WithTooltip: Story = {
  args: {
    label: 'Scheduled',
    tone: 'info',
    tooltip: 'Next run 14 Sep'
  }
}

export const Pulse: Story = {
  args: { label: 'Syncing', tone: 'info', pulse: true }
}

export const Loading: Story = {
  args: { completed: false }
}

export const ReadOnly: Story = {
  args: { label: 'Read only', tone: 'neutral', action: undefined }
}

export const AllTones: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <StatusIndicator label="Success" tone="success" />
      <StatusIndicator label="Warning" tone="warning" />
      <StatusIndicator label="Error" tone="error" />
      <StatusIndicator label="Info" tone="info" />
      <StatusIndicator label="Neutral" tone="neutral" />
    </Box>
  )
}
