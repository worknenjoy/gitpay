import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Constants from '../../../../../consts'

const IssueStatus = ({ status }) => {
  const intl = useIntl()
  const theme = useTheme()
  const isOpen = status !== 'closed'
  const color = isOpen ? theme.palette.success.main : theme.palette.warning.main

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: color,
          flexShrink: 0
        }}
      />
      <Typography variant="body2" sx={{ color, whiteSpace: 'nowrap' }}>
        {intl.formatMessage(Constants.STATUSES[status] || Constants.STATUSES['open'])}
      </Typography>
    </Box>
  )
}

export default IssueStatus
