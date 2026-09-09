import React from 'react'
import { Chip } from '@mui/material'

export type LinkChipProps = {
  icon?: React.ReactNode
  label: React.ReactNode
  href: string
}

const LinkChip = ({ icon, label, href }: LinkChipProps) => (
  <Chip
    component="a"
    href={href}
    target="_blank"
    rel="noreferrer"
    clickable
    icon={icon as React.ReactElement}
    label={label}
    variant="outlined"
    size="small"
    sx={{
      fontFamily: 'monospace',
      fontSize: 11.5,
      color: 'text.secondary',
      borderColor: 'divider',
      '&:hover': { borderColor: 'text.primary', color: 'text.primary' }
    }}
  />
)

export default LinkChip
