import React from 'react'
import { Chip, Skeleton, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { FormattedMessage } from 'react-intl'

export type SolutionStatusValue = 'open' | 'merged' | 'closed'

export type SolutionStatusProps = {
  status: SolutionStatusValue
  completed?: boolean
}

type StatusStyle = { color: string; bg: string; label: React.ReactNode }

/** Muted, light-fill chip styles — resolved from the theme so tokens and alpha() both work in sx. */
const buildConfig = (theme: any): Record<SolutionStatusValue, StatusStyle> => ({
  merged: {
    color: theme.palette.success.dark,
    bg: alpha(theme.palette.success.light, 0.15),
    label: <FormattedMessage id="account.profile.solutions.merged" defaultMessage="Merged" />
  },
  open: {
    color: theme.palette.text.secondary,
    bg: theme.palette.action.hover,
    label: <FormattedMessage id="account.profile.solutions.open" defaultMessage="Open" />
  },
  closed: {
    color: theme.palette.error.dark,
    bg: alpha(theme.palette.error.light, 0.15),
    label: <FormattedMessage id="account.profile.solutions.closed" defaultMessage="Closed" />
  }
})

/**
 * Status chip for a submitted solution (pull request) — open, merged, or closed without merge.
 */
const SolutionStatus = ({ status, completed = true }: SolutionStatusProps) => {
  const theme = useTheme()

  if (!completed) {
    return <Skeleton variant="rounded" width={70} height={24} />
  }

  const config = buildConfig(theme)
  const { color, bg, label } = config[status] || config.open

  return (
    <Chip
      size="small"
      label={label}
      sx={{
        color,
        bgcolor: bg,
        fontWeight: 600,
        '& .MuiChip-label': { px: 1.25 }
      }}
    />
  )
}

export default SolutionStatus
