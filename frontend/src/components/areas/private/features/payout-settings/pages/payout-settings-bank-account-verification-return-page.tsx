import React, { useEffect, useRef } from 'react'
import PayoutSettingsBankAccountVerificationReturn from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account-verification-return/payout-settings-bank-account-verification-return'

/**
 * Shown after Stripe/Whop hosted verification redirects back through the API.
 * The success alert must not depend on account.completed (that flag is the
 * Redux fetch loading state — fetchAccount sets it false and would keep the
 * alert on a skeleton forever while the request is in flight).
 */
const PayoutSettingsBankAccountVerificationReturnPage = ({ fetchAccount, addNotification }) => {
  const notifiedRef = useRef(false)

  useEffect(() => {
    if (typeof fetchAccount === 'function') {
      fetchAccount()
    }
    if (!notifiedRef.current && typeof addNotification === 'function') {
      notifiedRef.current = true
      addNotification('actions.user.account.verification.success', { severity: 'success' })
    }
  }, [fetchAccount, addNotification])

  // Always show the success content; account refresh is background-only
  return <PayoutSettingsBankAccountVerificationReturn completed />
}

export default PayoutSettingsBankAccountVerificationReturnPage
