import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import Tabs from '../base-tabs/base-tabs'

interface PayoutSetingsTabsProps {
  children: ReactNode
}

const PayoutSettingsTabs: React.FC<PayoutSetingsTabsProps> = ({ children }) => {
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
      link: '/profile/payout-settings/paypal'
    }
  ]

  return (
    <Tabs activeTab={'bank-account'} tabs={tabs}>
      {children}
    </Tabs>
  )
}
export default PayoutSettingsTabs
