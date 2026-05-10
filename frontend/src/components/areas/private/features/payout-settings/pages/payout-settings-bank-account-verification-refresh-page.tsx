import React, { useState } from 'react'
import PayoutSettingsBankAccountVerificationRefresh from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account-verification-refresh/payout-settings-bank-account-verification-refresh'

const PayoutSettingsBankAccountVerificationRefreshPage = ({ account, fetchAccountVerificationLink }) => {
  const [loading, setLoading] = useState(false)

  const handleResumeVerification = () => {
    setLoading(true)
    fetchAccountVerificationLink().finally(() => setLoading(false))
  }

  return (
    <PayoutSettingsBankAccountVerificationRefresh
      onResumeVerification={handleResumeVerification}
      completed={account?.completed && !loading}
    />
  )
}

export default PayoutSettingsBankAccountVerificationRefreshPage
