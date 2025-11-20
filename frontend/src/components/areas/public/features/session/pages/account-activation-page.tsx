import React from 'react'
import AccountActivation from 'design-library/pages/public-pages/session-public-pages/account-activation/account-activation'

const AccountActivationPage = ({ activateAccount }) => {
  return <AccountActivation onActivateAccount={activateAccount} />
}

export default AccountActivationPage
