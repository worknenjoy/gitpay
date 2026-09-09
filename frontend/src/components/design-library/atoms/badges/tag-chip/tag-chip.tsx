import React from 'react'
import { Chip } from '@mui/material'

export type TagChipProps = {
  label: React.ReactNode
  /** Visual treatment — 'neutral' is the default, low-emphasis tag style (e.g. skills, generic labels) */
  variant?: 'neutral' | 'outline' | 'accent'
  size?: 'small' | 'medium'
}

const TagChip = ({ label, variant = 'neutral', size = 'small' }: TagChipProps) => {
  const variantSx = {
    neutral: {
      color: 'text.secondary',
      bgcolor: 'action.hover',
      border: '1px solid transparent'
    },
    outline: {
      color: 'text.primary',
      bgcolor: 'transparent',
      border: '1px solid',
      borderColor: 'divider'
    },
    accent: {
      color: 'secondary.contrastText',
      bgcolor: 'secondary.main',
      border: '1px solid transparent'
    }
  }[variant]

  return (
    <Chip
      size={size}
      label={label}
      sx={{
        ...variantSx,
        fontFamily: 'monospace',
        fontSize: 11,
        letterSpacing: 0.3,
        '& .MuiChip-label': { px: 1 }
      }}
    />
  )
}

export default TagChip
