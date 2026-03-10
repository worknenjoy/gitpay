import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { Paper } from '@mui/material'
import Tabs from '../base-tabs/base-tabs'

interface PayoutSettingsTabsProps {
  children: ReactNode
}

const PayoutSettingsTabs: React.FC<PayoutSettingsTabsProps> = ({ children }) => {
  const tabs = [
    {
      label: (
        <FormattedMessage id="payout-settings.tabs.bank-account" defaultMessage="Bank Account" />
      ),
      value: 'bank-account',
      link: '/profile/payout-settings/bank-account'
    },
    {
      label: <FormattedMessage id="payout-settings.tabs.paypal" defaultMessage="PayPal" />,
      value: 'paypal',
      link: '/profile/payout-settings/paypal',
      disabled: true,
      tooltip: (
        <FormattedMessage
          id="general.temporarilyUnavailable"
          defaultMessage="Temporarily unavailable"
        />
      )
    }
  ]

  return (
    <Tabs activeTab={'bank-account'} tabs={tabs} withCard={false}>
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
        {children}
      </Paper>
    </Tabs>
  )
}
export default PayoutSettingsTabs
