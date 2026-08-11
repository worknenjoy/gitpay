import React from 'react'
import { FormattedMessage } from 'react-intl'
import { alpha } from '@mui/material/styles'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Tabs from '../base-tabs/base-tabs'

export type WhopAccountTabsProps = {
  children: React.ReactNode
  /** true when the Requirements & compliance section has items still due */
  requirementsDue?: boolean
}

/**
 * Vertical Whop payout sub-navigation matching the screenshots:
 * Identity & business · Payout method · Payout schedule & balances ·
 * Requirements & compliance · Disputes / refunds.
 */
const WhopAccountTabs = ({ children, requirementsDue }: WhopAccountTabsProps) => {
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
          defaultMessage="Payout schedule & balances"
        />
      ),
      value: 'schedule-balances',
      link: '/profile/payout-settings/whop/schedule-balances'
    },
    {
      label: (
        <FormattedMessage
          id="payout-settings.whop.tabs.requirements"
          defaultMessage="Requirements"
        />
      ),
      value: 'requirements',
      link: '/profile/payout-settings/whop/requirements',
      icon: requirementsDue ? (
        <WarningAmberIcon
          sx={{ color: (theme) => alpha(theme.palette.secondary.main, 0.7), fontSize: 18 }}
        />
      ) : (
        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
      )
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
