import React from 'react'
import { Box } from '@mui/material'
import StatusChip from './status-chip'

const meta = {
  title: 'Design Library/Atoms/Status/StatusChip',
  component: StatusChip,
  args: {
    label: 'Open',
    tone: 'success'
  }
}

export default meta

const Template = (args) => <StatusChip {...args} />

export const Success = Template.bind({})
Success.args = { label: 'Open', tone: 'success' }

export const Warning = Template.bind({})
Warning.args = { label: 'Pending', tone: 'warning' }

export const Error = Template.bind({})
Error.args = { label: 'Closed', tone: 'error' }

export const Info = Template.bind({})
Info.args = { label: 'In transit', tone: 'info' }

export const Neutral = Template.bind({})
Neutral.args = { label: 'Archived', tone: 'neutral' }

export const AllTones = () => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <StatusChip label="Open" tone="success" />
    <StatusChip label="Pending" tone="warning" />
    <StatusChip label="Closed" tone="error" />
    <StatusChip label="In transit" tone="info" />
    <StatusChip label="Archived" tone="neutral" />
  </Box>
)
