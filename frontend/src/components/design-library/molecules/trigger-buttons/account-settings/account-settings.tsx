import React, { useState } from 'react'
import AccountButton from '../../../atoms/buttons/account-button/account-button'
import ProfileAccountMenuItems from 'design-library/molecules/menus/profile-account-menu/profile-account-menu-items'

const AccountSettings = ({ user, accountMenuProps }) => {
  const { signOut } = accountMenuProps || {}
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
    setOpen(false)
  }
  return (
    <div style={{ display: 'flex', alignContent: 'center' }}>
      <AccountButton handleMenu={handleMenuOpen} user={user} />
      <ProfileAccountMenuItems
        includeDashboard
        open={open}
        anchorEl={anchorEl}
        handleClose={handleMenuClose}
        user={user}
        onLogout={signOut}
      />
    </div>
  )
}

export default AccountSettings
