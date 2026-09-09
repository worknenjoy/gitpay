import React from 'react'
import { Box } from '@mui/material'
import { Check as CheckIcon } from '@mui/icons-material'
import { useIntl } from 'react-intl'

export type VerifiedBadgeProps = {
  size?: 'small' | 'medium'
}

const VerifiedBadge = ({ size = 'medium' }: VerifiedBadgeProps) => {
  const intl = useIntl()
  const dimension = size === 'small' ? 16 : 20

  return (
    <Box
      component="span"
      aria-label={intl.formatMessage({
        id: 'profile.verifiedBadge.label',
        defaultMessage: 'Verified'
      })}
      sx={{
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        bgcolor: 'text.primary',
        color: 'background.paper',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <CheckIcon sx={{ fontSize: dimension * 0.65 }} />
    </Box>
  )
}

export default VerifiedBadge
