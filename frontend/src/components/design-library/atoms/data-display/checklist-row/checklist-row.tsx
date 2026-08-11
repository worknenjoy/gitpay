import React from 'react'
import { Box, Skeleton, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { FormattedMessage } from 'react-intl'

/** Muted/light variation of the palette secondary orange for "required" states. */
export const mutedRequiredColor = (theme: any) => alpha(theme.palette.secondary.main, 0.7)

export type ChecklistRowStatus = 'done' | 'required' | 'pending'

export type ChecklistRowProps = {
  title: React.ReactNode
  description?: React.ReactNode
  status: ChecklistRowStatus
  completed?: boolean
}

const statusMeta: Record<
  ChecklistRowStatus,
  { icon: React.ReactNode; color: string; label: React.ReactNode }
> = {
  done: {
    icon: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />,
    color: 'success.main',
    label: <FormattedMessage id="payout-settings.checklist.done" defaultMessage="Done" />
  },
  required: {
    icon: <WarningAmberIcon sx={{ color: mutedRequiredColor, fontSize: 20 }} />,
    color: 'secondary.dark',
    label: (
      <FormattedMessage id="payout-settings.checklist.requiredNow" defaultMessage="Required now" />
    )
  },
  pending: {
    icon: <AccessTimeIcon sx={{ color: 'info.main', fontSize: 20 }} />,
    color: 'info.main',
    label: <FormattedMessage id="payout-settings.checklist.pending" defaultMessage="Pending" />
  }
}

/**
 * One agnostic requirement row: leading status icon, title + description,
 * right-aligned status label. Used by the Requirements & compliance checklist.
 */
const ChecklistRow = ({ title, description, status, completed = true }: ChecklistRowProps) => {
  const meta = statusMeta[status] || statusMeta.pending
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        py: 1.75,
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ mt: 0.25 }}>
        {completed ? meta.icon : <Skeleton variant="circular" width={20} height={20} />}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {completed ? (
          <>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {description ? (
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            ) : null}
          </>
        ) : (
          <Skeleton variant="text" width="60%" />
        )}
      </Box>
      <Typography
        variant="caption"
        sx={{ color: meta.color, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, mt: 0.25 }}
      >
        {completed ? meta.label : null}
      </Typography>
    </Box>
  )
}

export default ChecklistRow
