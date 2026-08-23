import React from 'react'
import { Box, Typography, Chip } from '@mui/material'

type CheckoutMerchantSummaryProps = {
  title: string
  description?: string
}

/**
 * Shows only the payment request's own title/description — never seller identity
 * or contact details (email, avatar, etc.), which the public checkout API doesn't
 * return in the first place.
 */
const CheckoutMerchantSummary = ({ title, description }: CheckoutMerchantSummaryProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        p: 2,
        bgcolor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 1.5,
        mb: 3
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight={700} noWrap>
          {title}
        </Typography>
        {description && (
          <Typography variant="caption" color="text.secondary" noWrap component="div">
            {description}
          </Typography>
        )}
      </Box>
      <Chip label="Payment request" size="small" color="primary" variant="outlined" />
    </Box>
  )
}

export default CheckoutMerchantSummary
