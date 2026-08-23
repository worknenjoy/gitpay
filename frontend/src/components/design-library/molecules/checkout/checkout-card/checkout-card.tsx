import React from 'react'
import { Box, Typography } from '@mui/material'

type CheckoutCardProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

/** White card shell for a checkout step: title, muted subtitle, padded body. */
const CheckoutCard = ({ title, subtitle, children }: CheckoutCardProps) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
        boxShadow: '0 1px 2px rgba(0,0,0,.04), 0 12px 32px rgba(40,30,20,.05)',
        p: { xs: 3, sm: 4 }
      }}
    >
      <Typography variant="h5" sx={{ mb: subtitle ? 0.5 : 2 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Box>
  )
}

export default CheckoutCard
