import React, { useState } from 'react'
import PayoutSettingsBankAccountVerification from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account-verification/payout-settings-bank-account-verification'

const PayoutSettingsBankAccountVerificationPage = ({ account, fetchAccountVerificationLink }) => {
  const [loading, setLoading] = useState(false)

  const handleCompleteVerification = () => {
    setLoading(true)
    fetchAccountVerificationLink().finally(() => setLoading(false))
  }

  return (
    <PayoutSettingsBankAccountVerification
      account={account}
      onCompleteVerification={handleCompleteVerification}
      completed={account?.completed && !loading}
    />
  )
}

export default PayoutSettingsBankAccountVerificationPage
