import React from 'react'
import { Chip } from '@mui/material'
import { amber } from '@mui/material/colors'

export type RolePillProps = {
  name: React.ReactNode
  active?: boolean
  tone?: 'orange' | 'teal' | 'yellow'
}

const RolePill = ({ name, active = false, tone = 'orange' }: RolePillProps) => {
  const toneColor = {
    orange: 'secondary.main',
    teal: 'primary.main',
    yellow: amber[800]
  }[tone]

  return (
    <Chip
      label={name}
      variant="outlined"
      size="small"
      sx={{
        fontFamily: 'monospace',
        fontSize: 11,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        borderRadius: 999,
        color: active ? toneColor : 'text.secondary',
        borderColor: active ? toneColor : 'divider',
        bgcolor: 'transparent'
      }}
    />
  )
}

export default RolePill
