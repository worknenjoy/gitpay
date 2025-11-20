import React from 'react'
import AccountTabs from '../../../../molecules/tabs/account-tabs/account-tabs'

const AccountSettings = ({ user, children }) => {
  return <AccountTabs user={user}>{children}</AccountTabs>
}

export default AccountSettings
