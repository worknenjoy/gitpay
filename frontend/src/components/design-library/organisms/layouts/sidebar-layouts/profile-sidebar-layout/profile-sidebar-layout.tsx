import React from 'react'
import useProfileSidebarMenu from '../../../../../../hooks/use-profile-sidebar-menu'
import { SideMenu } from '../../../../molecules/menus/side-menu/side-menu'

const ProfileSidebar = ({ user }) => {
  const { completed, menuItems } = useProfileSidebarMenu({ user })

  return (
    <div>
      <SideMenu completed={completed} menuItems={menuItems} />
    </div>
  )
}

export default ProfileSidebar
