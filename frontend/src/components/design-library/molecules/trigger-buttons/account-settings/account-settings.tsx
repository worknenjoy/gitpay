import React, { useState } from 'react'
import AccountButton from '../../../atoms/buttons/account-button/account-button'
import AccountMenu from '../../menus/account-menu/account-menu'

const AccountSettings = ({ user, accountMenuProps }) => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <AccountButton handleMenu={() => setOpen(!open)} user={user} />
      <AccountMenu
        handleClose={() => setOpen(false)}
        open={open}
        user={user}
        {...accountMenuProps}
      />
    </div>
  )
}

export default AccountSettings
