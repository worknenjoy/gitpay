import React from 'react'
import { Skeleton, Tooltip } from '@mui/material'
import type { StatusChipTone } from '../status-chip/status-chip.styles'
import { Root, Pill, Dot, ActionButton } from './status-indicator.styles'

export type StatusIndicatorAction = {
  label: React.ReactNode
  icon?: React.ReactNode
  onClick: () => void
}

export type StatusIndicatorProps = {
  /** Text next to the dot; callers compose it (e.g. `Automatic withdrawals · <b>Weekly</b>`) */
  label: React.ReactNode
  tone?: StatusChipTone
  /** Animated dot for in-progress states */
  pulse?: boolean
  /** Extra detail shown on hover over the pill */
  tooltip?: React.ReactNode
  /** Small outlined button after the pill. Omit for a read-only indicator. */
  action?: StatusIndicatorAction
  /** completed === false -> skeleton placeholder */
  completed?: boolean
}

/**
 * One-line status: a toned dot, a label, and an optional action button.
 * Provider/domain agnostic — domain components (e.g. AutoWithdrawalStatus) compose it.
 */
const StatusIndicator = ({
  label,
  tone = 'neutral',
  pulse = false,
  tooltip,
  action,
  completed = true
}: StatusIndicatorProps) => {
  if (!completed) {
    return (
      <Skeleton
        variant="rounded"
        animation="wave"
        width={220}
        height={28}
        sx={{ borderRadius: 999 }}
      />
    )
  }

  const pill = (
    <Pill role="status">
      <Dot tone={tone} pulse={pulse} aria-hidden />
      <span>{label}</span>
    </Pill>
  )

  return (
    <Root>
      {tooltip ? (
        <Tooltip title={tooltip} arrow>
          {pill}
        </Tooltip>
      ) : (
        pill
      )}
      {action && (
        <ActionButton
          variant="outlined"
          size="small"
          startIcon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </ActionButton>
      )}
    </Root>
  )
}

export default StatusIndicator
