import React, { ReactNode } from 'react'
import { Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Tabs from '../base-tabs/base-tabs'
import DeprecatedBadge from '../../../atoms/badges/deprecated-badge/deprecated-badge'

export type PayoutProviderTabsProps = {
  children: ReactNode
  /** User has a legacy Stripe connected account (enables the Stripe tab) */
  hasStripeAccount?: boolean
  /** User has a legacy PayPal account (enables the PayPal tab) */
  hasPaypalAccount?: boolean
  /** Which tab is active: 'whop' | 'stripe' | 'paypal' */
  activeTab?: 'whop' | 'stripe' | 'paypal'
}

const withBadge = (label: ReactNode) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
    {label}
    <DeprecatedBadge />
  </Box>
)

/**
 * Top-level payout provider tabs: Whop | Stripe (deprecated) | PayPal (deprecated).
 * Whop is always enabled. Deprecated tabs are only clickable when the user has that
 * legacy account; otherwise they are disabled with a tooltip.
 */
const PayoutProviderTabs = ({
  children,
  hasStripeAccount = false,
  hasPaypalAccount = false,
  activeTab = 'whop'
}: PayoutProviderTabsProps) => {
  const deprecatedTooltip = (
    <FormattedMessage
      id="payout-settings.tabs.deprecated.tooltip"
      defaultMessage="This payout method is deprecated and can't be set up. Use Whop instead."
    />
  )

  const tabs = [
    {
      label: <FormattedMessage id="payout-settings.tabs.whop" defaultMessage="Whop" />,
      value: 'whop',
      link: '/profile/payout-settings/whop'
    },
    {
      label: withBadge(
        <FormattedMessage id="payout-settings.tabs.stripe" defaultMessage="Stripe" />
      ),
      value: 'stripe',
      link: '/profile/payout-settings/bank-account',
      disabled: !hasStripeAccount,
      tooltip: !hasStripeAccount ? deprecatedTooltip : undefined
    },
    {
      label: withBadge(
        <FormattedMessage id="payout-settings.tabs.paypal" defaultMessage="PayPal" />
      ),
      value: 'paypal',
      link: '/profile/payout-settings/paypal',
      disabled: !hasPaypalAccount,
      tooltip: !hasPaypalAccount ? deprecatedTooltip : undefined
    }
  ]

  return (
    <Tabs activeTab={activeTab} tabs={tabs} withCard={false}>
      {children}
    </Tabs>
  )
}

export default PayoutProviderTabs
