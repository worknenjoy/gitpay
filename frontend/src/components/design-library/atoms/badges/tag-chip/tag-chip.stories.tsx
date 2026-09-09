import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Box } from '@mui/material'
import TagChip from './tag-chip'

const meta: Meta<typeof TagChip> = {
  title: 'Design Library/Atoms/Badges/TagChip',
  component: TagChip,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof TagChip>

export const Neutral: Story = {
  args: {
    label: 'TypeScript',
    variant: 'neutral'
  }
}

export const Outline: Story = {
  args: {
    label: 'good first issue',
    variant: 'outline'
  }
}

export const Accent: Story = {
  args: {
    label: 'Featured',
    variant: 'accent'
  }
}

export const SkillsRow: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: 420 }}>
      {['TypeScript', 'JavaScript', 'React', 'Node.js', 'GraphQL', 'PostgreSQL'].map((skill) => (
        <TagChip key={skill} label={skill} variant="neutral" />
      ))}
    </Box>
  )
}
