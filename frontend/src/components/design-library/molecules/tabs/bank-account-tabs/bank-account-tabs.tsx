import React from 'react'
import { FormattedMessage } from 'react-intl'
import Tabs from '../base-tabs/base-tabs'

const BankAccountTabs = ({ children }) => {
  const tabs = [
    {
      label: (
        <FormattedMessage
          id="payout-settings.tabs.bank-account.accountHolder"
          defaultMessage="Account holder details"
        />
      ),
      value: 'account-holder',
      link: '/profile/payout-settings/bank-account/account-holder',
    },
    {
      label: (
        <FormattedMessage
          id="payout-settings.tabs.bank-account.bankInfo"
          defaultMessage="Bank account information"
        />
      ),
      value: 'bank-info',
      link: '/profile/payout-settings/bank-account/bank-account-info',
    },
    {
      label: (
        <FormattedMessage
          id="payout-settings.tabs.bank-account.payoutSchedule"
          defaultMessage="Payout Schedule"
        />
      ),
      value: 'payout-schedule',
      link: '/profile/payout-settings/bank-account/payout-schedule',
    },
  ]

  return (
    <Tabs activeTab={'account-holder'} tabs={tabs} orientation="vertical">
      {children}
    </Tabs>
  )
}
export default BankAccountTabs
