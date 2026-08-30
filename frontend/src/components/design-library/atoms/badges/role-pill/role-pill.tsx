import React from 'react'
import { Chip } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export type RoleTone = 'orange' | 'teal' | 'yellow' | 'pink'

type RolePillProps = {
  name: React.ReactNode
  active?: boolean
  tone?: RoleTone
}

const RolePill = ({ name, active = false, tone = 'orange' }: RolePillProps) => {
  const theme = useTheme()

  const toneColor =
    tone === 'teal'
      ? (theme.palette as any).accent?.teal
      : tone === 'yellow'
        ? (theme.palette as any).accent?.yellow
        : tone === 'pink'
          ? (theme.palette as any).accent?.pink
          : theme.palette.secondary.main

  return (
    <Chip
      size="small"
      label={name}
      variant={active ? 'filled' : 'outlined'}
      sx={
        active
          ? { bgcolor: toneColor, color: theme.palette.getContrastText(toneColor || '#000') }
          : { borderColor: toneColor, color: toneColor }
      }
    />
  )
}

export default RolePill
