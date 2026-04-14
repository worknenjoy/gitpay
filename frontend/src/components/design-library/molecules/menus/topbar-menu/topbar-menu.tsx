import React from 'react'
import {
  LinkButton,
  LabelButton
} from '../../../organisms/layouts/topbar-layouts/topbar-layout/TopbarStyles'
import useMainNavItems from '../../../../../hooks/use-main-nav-items'

export const TopbarMenu = () => {
  const navItems = useMainNavItems()

  return (
    <>
      {navItems.map((item) => (
        <LinkButton
          key={item.id}
          onClick={
            item.external
              ? () => window.open(item.href)
              : () => window.location.assign('/#' + (item.topbarPath || item.path))
          }
          variant="text"
          size="small"
          color="primary"
        >
          <LabelButton>{item.label}</LabelButton>
        </LinkButton>
      ))}
    </>
  )
}

export default TopbarMenu
