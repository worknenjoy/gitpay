import React from 'react'
import { Box, Divider, Typography } from '@mui/material'

export type SectionDividerProps = {
  label: React.ReactNode
}

const SectionDivider = ({ label }: SectionDividerProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 4 }}>
    <Typography
      variant="overline"
      sx={{ color: 'text.secondary', letterSpacing: 1, whiteSpace: 'nowrap' }}
    >
      {label}
    </Typography>
    <Divider sx={{ flex: 1 }} />
  </Box>
)

export default SectionDivider
