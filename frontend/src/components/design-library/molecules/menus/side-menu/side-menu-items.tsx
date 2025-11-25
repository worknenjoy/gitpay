import { Typography, Tooltip } from '@mui/material'
import React from 'react'
import {
  MenuItemStyled,
  Primary,
  Category,
  ListItemIconStyled,
  MenuListStyled
} from './side-menu-items.styles'
import SideMenuCollapseButton from './side-menu-collapse-button'

type SideMenuItemsProps = {
  menuItems: {
    category?: React.ReactNode
    items: {
      include: boolean
      onClick: () => void
      icon: React.ReactElement
      label: React.ReactNode
      selected?: boolean
    }[]
  }[]
  compactMode?: boolean
  setCompactMode?: (compactMode: boolean) => void
}

const SideMenuItems = ({ menuItems, compactMode, setCompactMode }: SideMenuItemsProps) => {
  const handleCompactModeToggle = () => {
    if (setCompactMode) {
      setCompactMode(!compactMode)
    }
  }
  return (
    <div style={{ position: 'relative' }}>
      <SideMenuCollapseButton collapsed={compactMode} setCollapsed={handleCompactModeToggle} />
      <MenuListStyled compact={compactMode}>
        {menuItems.map((section, sectionIndex) => (
          <div
            key={`section-${sectionIndex}`}
            style={{ width: '100%', ...(compactMode ? { textAlign: 'center' } : {}) }}
          >
            {section.category && (
              <Typography
                variant="caption"
                component={Category as any}
                style={{ marginTop: sectionIndex === 0 ? 0 : 16 }}
              >
                {section.category}
              </Typography>
            )}
            {section.items.map(
              (item, index) =>
                item.include && (
                  <MenuItemStyled
                    key={`item-${sectionIndex}-${index}`}
                    onClick={item.onClick}
                    selected={item.selected}
                  >
                    <Tooltip
                      title={compactMode ? item.label : ''}
                      placement="right"
                      disableHoverListener={!compactMode}
                      sx={{ verticalAlign: 'middle' }}
                    >
                      <ListItemIconStyled sx={{ pr: compactMode ? 0 : 2 }}>
                        {item.icon}
                      </ListItemIconStyled>
                    </Tooltip>
                    {!compactMode && <Primary primary={item.label} />}
                  </MenuItemStyled>
                )
            )}
          </div>
        ))}
      </MenuListStyled>
    </div>
  )
}

export default SideMenuItems
