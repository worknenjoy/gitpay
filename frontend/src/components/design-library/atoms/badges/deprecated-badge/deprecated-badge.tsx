import React from 'react'
import { Chip } from '@mui/material'
import { FormattedMessage } from 'react-intl'

export type DeprecatedBadgeProps = {
  /** Override the default "DEPRECATED" label */
  label?: React.ReactNode
  size?: 'small' | 'medium'
}

/**
 * Small neutral chip flagging a deprecated payout provider (Stripe / PayPal).
 * Agnostic display atom — no provider logic.
 */
const DeprecatedBadge = ({ label, size = 'small' }: DeprecatedBadgeProps) => (
  <Chip
    size={size}
    variant="outlined"
    label={
      label || (
        <FormattedMessage id="payout-settings.badge.deprecated" defaultMessage="DEPRECATED" />
      )
    }
    sx={{
      color: 'text.secondary',
      borderColor: 'divider',
      bgcolor: 'action.hover',
      fontSize: 11,
      letterSpacing: 0.5,
      height: 20,
      '& .MuiChip-label': { px: 1 }
    }}
  />
)

export default DeprecatedBadge
