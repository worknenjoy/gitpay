import React from 'react'
import { Paper, Typography } from '@mui/material'
import PayoutProviderTabs from './payout-provider-tabs'

const meta = {
  title: 'Design Library/Molecules/Tabs/PayoutProviderTabs',
  component: PayoutProviderTabs
}

export default meta

const Panel = (
  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
    <Typography>Active provider panel content</Typography>
  </Paper>
)

export const WhopOnly = {
  args: { children: Panel }
}

export const WithStripe = {
  args: { children: Panel, hasStripeAccount: true }
}

export const WithPaypal = {
  args: { children: Panel, hasPaypalAccount: true, hasStripeAccount: true }
}
