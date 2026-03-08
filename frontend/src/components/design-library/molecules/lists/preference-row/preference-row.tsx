import React from 'react'
import { Box, Divider, Typography } from '@mui/material'

export type PreferenceRowProps = {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  divider?: boolean
}

const PreferenceRow = ({ title, description, action, divider = false }: PreferenceRowProps) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          px: 2.5,
          py: 2
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          ) : null}
        </Box>

        {action ? (
          <Box sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'center' } }}>{action}</Box>
        ) : null}
      </Box>

      {divider ? <Divider /> : null}
    </>
  )
}

export default PreferenceRow
