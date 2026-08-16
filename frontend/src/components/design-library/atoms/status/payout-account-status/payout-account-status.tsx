import React from 'react'
import { Chip, Skeleton, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { FormattedMessage } from 'react-intl'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

export type PayoutAccountStatusValue = 'active' | 'verification_required' | 'pending' | 'rejected'

export type PayoutAccountStatusProps = {
  status: PayoutAccountStatusValue
  completed?: boolean
}

type StatusStyle = { color: string; bg: string; label: React.ReactNode }

/** Resolve concrete colors from the theme so tokens and alpha() both work in sx. */
const buildConfig = (theme: any): Record<PayoutAccountStatusValue, StatusStyle> => ({
  active: {
    color: theme.palette.success.dark,
    bg: alpha(theme.palette.success.light, 0.15),
    label: (
      <FormattedMessage id="payout-settings.status.payoutsActive" defaultMessage="PAYOUTS ACTIVE" />
    )
  },
  verification_required: {
    // Muted/light variation of the palette secondary orange to match the design.
    color: theme.palette.secondary.dark,
    bg: alpha(theme.palette.secondary.main, 0.15),
    label: (
      <FormattedMessage
        id="payout-settings.status.verificationRequired"
        defaultMessage="VERIFICATION REQUIRED"
      />
    )
  },
  pending: {
    color: theme.palette.text.secondary,
    bg: theme.palette.action.hover,
    label: <FormattedMessage id="payout-settings.status.pending" defaultMessage="PENDING" />
  },
  rejected: {
    color: theme.palette.error.dark,
    bg: alpha(theme.palette.error.light, 0.15),
    label: <FormattedMessage id="payout-settings.status.rejected" defaultMessage="REJECTED" />
  }
})

/**
 * Pill badge for the connected payout account state (screenshot header badge).
 * Agnostic display atom driven by a normalized status value.
 */
const PayoutAccountStatus = ({ status, completed = true }: PayoutAccountStatusProps) => {
  const theme = useTheme()
  if (!completed) {
    return <Skeleton variant="rounded" width={140} height={22} />
  }
  const config = buildConfig(theme)
  const { color, bg, label } = config[status] || config.pending
  return (
    <Chip
      size="small"
      icon={<FiberManualRecordIcon sx={{ fontSize: 10, color: `${color} !important` }} />}
      label={label}
      sx={{
        color,
        bgcolor: bg,
        fontSize: 11,
        letterSpacing: 0.5,
        fontWeight: 600,
        height: 22,
        '& .MuiChip-label': { px: 1 }
      }}
    />
  )
}

export default PayoutAccountStatus
