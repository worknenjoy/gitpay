import React from 'react'
import PayoutSettingsBankAccountVerificationReturn from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account-verification-return/payout-settings-bank-account-verification-return'

const PayoutSettingsBankAccountVerificationReturnPage = ({ account }) => {
  return <PayoutSettingsBankAccountVerificationReturn completed={account?.completed} />
}

export default PayoutSettingsBankAccountVerificationReturnPage
