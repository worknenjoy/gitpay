import React from 'react'
import AccountActivation from 'design-library/pages/public-pages/session-public-pages/account-activation/account-activation'

const AccountActivationPage = ({ activateAccount, checkStatus }) => {
  return <AccountActivation onActivateAccount={activateAccount} onCheckStatus={checkStatus} />
}

export default AccountActivationPage
