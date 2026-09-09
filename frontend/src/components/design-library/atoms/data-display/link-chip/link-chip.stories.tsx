import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Box } from '@mui/material'
import { Language as LanguageIcon, GitHub as GitHubIcon } from '@mui/icons-material'
import LinkChip from './link-chip'

const meta: Meta<typeof LinkChip> = {
  title: 'Design Library/Atoms/Data Display/LinkChip',
  component: LinkChip,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof LinkChip>

export const Website: Story = {
  args: {
    icon: <LanguageIcon fontSize="small" />,
    label: 'blog.alexandremagno.net/en',
    href: 'https://blog.alexandremagno.net/en'
  }
}

export const Handle: Story = {
  args: {
    icon: <GitHubIcon fontSize="small" />,
    label: '@alexandremagno',
    href: 'https://github.com/alexandremagno'
  }
}

export const Row: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <LinkChip
        icon={<LanguageIcon fontSize="small" />}
        label="blog.alexandremagno.net/en"
        href="https://blog.alexandremagno.net/en"
      />
      <LinkChip
        icon={<GitHubIcon fontSize="small" />}
        label="@alexandremagno"
        href="https://github.com/alexandremagno"
      />
    </Box>
  )
}
