import React from 'react'
import { Box, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import logo from 'images/gitpay-logo.png'

/**
 * Shell for the public, provider-agnostic payment pages (e.g. Whop custom-amount
 * checkout). Deliberately low on Gitpay branding: this page represents the seller's
 * payment request, not a Gitpay storefront, so the request's own title carries the
 * primary context. Only a small mark + a "secure payment" indicator are shown.
 */
type CheckoutShellProps = {
  children: React.ReactNode
  /** Content column max width. Wider layouts (e.g. a two-column checkout) can override this. */
  maxWidth?: number
}

const CheckoutShell = ({ children, maxWidth = 480 }: CheckoutShellProps) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.75,
          py: 2.5,
          opacity: 0.6
        }}
      >
        <Box component="img" src={logo} alt="Gitpay" sx={{ height: 18, display: 'block' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LockOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Secure payment
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2,
          pb: 6
        }}
      >
        <Box sx={{ width: '100%', maxWidth }}>{children}</Box>
      </Box>
    </Box>
  )
}

export default CheckoutShell
