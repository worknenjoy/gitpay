import React, { useState } from 'react'
import logo from 'images/gitpay-logo-small.png'
import compactLogo from 'images/logo-symbol-small.png'
import {
  IconHamburger,
  LeftSide,
  Logo,
  MenuMobile,
  OnlyDesktop,
  OnlyMobile,
  RightSide,
  StyledButton
} from './side-menu.styled.div'
import { SidePaper, Row, MainHeaderWrapper, Profile } from './side-menu.styles'
import SideMenuItems from './side-menu-items'
import SidebarMenuPlaceholder from './side-menu.placeholder'

interface MenuItemProps {
  include: boolean
  onClick: () => void
  icon: React.ReactElement
  label: React.ReactNode
  selected?: boolean
}

interface SideMenuProps {
  completed: boolean
  menuItems: {
    category?: React.ReactNode
    items: MenuItemProps[]
  }[]
  compactMode?: boolean
}

export const SideMenu: React.FC<SideMenuProps> = ({ completed, menuItems }) => {
  const [ compactMode, setCompactMode ] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const handleClickMenuMobile = () => {
    setIsActive(!isActive)
  }

  const menuItemsMobile = menuItems.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => {
        setIsActive(false)
        item.onClick()
      }
    }))
  }))

  return (
    <SidePaper>
      <Profile>
        <LeftSide isActive={isActive}>
          <MainHeaderWrapper>
            <StyledButton href="/">
              {compactMode ?
                <Logo compact src={compactLogo} /> :
                <Logo src={logo} width={120} />
              }
            </StyledButton>
            <MenuMobile onClick={handleClickMenuMobile} variant="text" size="small" sx={{ display: { md: 'none' } }}>
              <IconHamburger isActive={isActive} />
            </MenuMobile>
          </MainHeaderWrapper>
        </LeftSide>
        <RightSide isActive={isActive}>
          <Row>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '5px 20px'
              }}
            >
              {completed ? (
                <OnlyDesktop>
                  <SideMenuItems menuItems={menuItems} compactMode={compactMode} setCompactMode={setCompactMode} />
                </OnlyDesktop>
              ) : (
                <SidebarMenuPlaceholder />
              )}

              {completed ? (
                <OnlyMobile>
                  <SideMenuItems menuItems={menuItemsMobile} />
                </OnlyMobile>
              ) : (
                <SidebarMenuPlaceholder />
              )}
            </div>
          </Row>
        </RightSide>
      </Profile>

    </SidePaper>
  )
}
