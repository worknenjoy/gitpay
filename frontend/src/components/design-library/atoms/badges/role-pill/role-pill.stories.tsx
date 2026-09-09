import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Box } from '@mui/material'
import RolePill from './role-pill'

const meta: Meta<typeof RolePill> = {
  title: 'Design Library/Atoms/Badges/RolePill',
  component: RolePill,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof RolePill>

export const ActiveOrange: Story = {
  args: { name: 'contributor', active: true, tone: 'orange' }
}

export const ActiveTeal: Story = {
  args: { name: 'maintainer', active: true, tone: 'teal' }
}

export const ActiveYellow: Story = {
  args: { name: 'provider', active: true, tone: 'yellow' }
}

export const Inactive: Story = {
  args: { name: 'contributor', active: false }
}

export const Row: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <RolePill name="contributor" active tone="orange" />
      <RolePill name="maintainer" tone="teal" />
      <RolePill name="provider" tone="yellow" />
    </Box>
  )
}
