import React from 'react'
import { FormattedMessage } from 'react-intl'
import Tabs from '../base-tabs/base-tabs'

export type WhopAccountTabsProps = {
  children: React.ReactNode
}

/**
 * Vertical Whop payout sub-navigation: Identity & business · Payout method ·
 * Payout schedule & balances · Disputes / refunds.
 *
 * "Requirements & compliance" was removed (temporarily) — its checklist was derived
 * from a Whop field that turned out to mean something else; see getWhopAccountStatus.ts.
 */
const WhopAccountTabs = ({ children }: WhopAccountTabsProps) => {
  const tabs = [
    {
      label: (
        <FormattedMessage
          id="payout-settings.whop.tabs.identity"
          defaultMessage="Identity & business"
        />
      ),
      value: 'identity',
      link: '/profile/payout-settings/whop/identity'
    },
    {
      label: (
        <FormattedMessage
          id="payout-settings.whop.tabs.payoutMethod"
          defaultMessage="Payout method"
        />
      ),
      value: 'payout-method',
      link: '/profile/payout-settings/whop/payout-method'
    },
    {
      label: (
        <FormattedMessage
          id="payout-settings.whop.tabs.scheduleBalances"
          defaultMessage="Payout schedule"
        />
      ),
      value: 'schedule-balances',
      link: '/profile/payout-settings/whop/schedule-balances'
    },
    {
      label: (
        <FormattedMessage
          id="payout-settings.whop.tabs.disputes"
          defaultMessage="Disputes / refunds"
        />
      ),
      value: 'disputes',
      link: '/profile/payout-settings/whop/disputes'
    }
  ]

  return (
    <Tabs activeTab={'identity'} tabs={tabs} orientation="vertical">
      {children}
    </Tabs>
  )
}

export default WhopAccountTabs
