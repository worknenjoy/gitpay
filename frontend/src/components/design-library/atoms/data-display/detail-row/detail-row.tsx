import React from 'react'
import { Box, Chip, Skeleton, Typography } from '@mui/material'

export type DetailRowProps = {
  /** Uppercase caption label on the left */
  label: React.ReactNode
  /** Primary value on the right */
  value?: React.ReactNode
  /** Small secondary hint shown next to the value */
  hint?: React.ReactNode
  /** Optional status chip label rendered instead of/with the value (e.g. VERIFIED) */
  status?: React.ReactNode
  statusColor?: 'success' | 'warning' | 'error' | 'default' | 'info'
  completed?: boolean
}

/**
 * One agnostic label→value row for read-only detail views (Identity & business,
 * payout method, schedule). Not a form field.
 */
const DetailRow = ({
  label,
  value,
  hint,
  status,
  statusColor = 'default',
  completed = true
}: DetailRowProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
      gap: { xs: 0.5, sm: 2 },
      py: 1.5,
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}
  >
    <Typography
      variant="caption"
      sx={{
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        flexShrink: 0,
        minWidth: { sm: 180 }
      }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        justifyContent: { sm: 'flex-end' },
        textAlign: { sm: 'right' },
        flexGrow: 1
      }}
    >
      {!completed ? (
        <Skeleton variant="text" width={160} />
      ) : (
        <>
          {status ? (
            <Chip
              size="small"
              color={statusColor === 'default' ? undefined : statusColor}
              label={status}
              sx={{ height: 22, fontSize: 11 }}
            />
          ) : null}
          {value != null && value !== '' ? (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {value}
            </Typography>
          ) : status ? null : (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          )}
          {hint ? (
            <Typography variant="caption" color="text.secondary">
              {hint}
            </Typography>
          ) : null}
        </>
      )}
    </Box>
  </Box>
)

export default DetailRow
