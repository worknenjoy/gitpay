import React from 'react'
import { Box, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

type CheckoutFootNoteProps = {
  children: React.ReactNode
}

/** Small centered reassurance line with an info icon. */
const CheckoutFootNote = ({ children }: CheckoutFootNoteProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 0.75,
        mt: 2,
        px: 2
      }}
    >
      <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary', mt: '2px' }} />
      <Typography variant="caption" color="text.secondary" textAlign="center">
        {children}
      </Typography>
    </Box>
  )
}

export default CheckoutFootNote
