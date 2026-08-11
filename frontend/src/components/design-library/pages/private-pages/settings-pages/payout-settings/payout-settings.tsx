import React from 'react'
import { Paper } from '@mui/material'
import PayoutProviderTabs from '../../../../molecules/tabs/payout-provider-tabs/payout-provider-tabs'

type PayoutSettingsProps = {
  children: React.ReactNode
  activeTab?: 'whop' | 'stripe' | 'paypal'
  hasStripeAccount?: boolean
  hasPaypalAccount?: boolean
}

/**
 * Payout Settings shell: top-level provider tabs (Whop | Stripe | PayPal) wrapping
 * the active provider's panel. Deprecated tabs are only enabled when the user has
 * that legacy account.
 */
const PayoutSettings = ({
  children,
  activeTab = 'whop',
  hasStripeAccount = false,
  hasPaypalAccount = false
}: PayoutSettingsProps) => {
  return (
    <PayoutProviderTabs
      activeTab={activeTab}
      hasStripeAccount={hasStripeAccount}
      hasPaypalAccount={hasPaypalAccount}
    >
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
        {children}
      </Paper>
    </PayoutProviderTabs>
  )
}

export default PayoutSettings
