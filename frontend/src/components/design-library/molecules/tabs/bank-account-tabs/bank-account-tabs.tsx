import React from 'react'
import { FormattedMessage } from 'react-intl'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Tabs from '../base-tabs/base-tabs'
import { VerificationStatus } from '../../../../../types/account'

const verificationIcons: Record<VerificationStatus, React.ReactNode> = {
  warning: <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 18 }} />,
  upcoming: <AccessTimeIcon sx={{ color: 'info.main', fontSize: 18 }} />,
  verified: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20, flexShrink: 0, opacity: 1 }} />
}

const BankAccountTabs = ({
  children,
  verificationStatus,
  verificationTabDisabled
}: {
  children: React.ReactNode
  verificationStatus?: VerificationStatus
  verificationTabDisabled?: boolean
}) => {
  const tabs = [
    {
      label: (
        <FormattedMessage
          id="payout-settings.tabs.bank-account.accountHolder"
          defaultMessage="Account holder details"
        />
      ),
      value: 'account-holder',
      link: '/profile/payout-settings/bank-account/account-holder'
    },
    {
      label: (
        <FormattedMessage
          id="payout-settings.tabs.bank-account.bankInfo"
          defaultMessage="Bank account information"
        />
      ),
      value: 'bank-info',
      link: '/profile/payout-settings/bank-account/bank-account-info'
    },
    {
      label: (
        <FormattedMessage
          id="payout-settings.tabs.bank-account.payoutSchedule"
          defaultMessage="Payout Schedule"
        />
      ),
      value: 'payout-schedule',
      link: '/profile/payout-settings/bank-account/payout-schedule'
    },
    {
      label: (
        <FormattedMessage
          id="payout-settings.tabs.bank-account.accountVerification"
          defaultMessage="Additional requirements"
        />
      ),
      value: 'account-verification',
      link: '/profile/payout-settings/bank-account/account-verification',
      icon: verificationStatus ? verificationIcons[verificationStatus] : undefined,
      disabled: verificationTabDisabled,
      tooltip: verificationTabDisabled ? (
        <FormattedMessage
          id="payout-settings.tabs.bank-account.accountVerification.disabled"
          defaultMessage="Complete your account details first"
        />
      ) : undefined
    }
  ]

  return (
    <Tabs activeTab={'account-holder'} tabs={tabs} orientation="vertical">
      {children}
    </Tabs>
  )
}
export default BankAccountTabs
