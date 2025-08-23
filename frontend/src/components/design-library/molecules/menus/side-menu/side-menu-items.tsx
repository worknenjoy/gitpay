
import { MenuList, Typography, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { MenuItemStyled, Primary, Icon, Category } from './side-menu-items.styles'

const SideMenuItems = ({
  menuItems
}) => {
  return (
    <MenuList>
      {menuItems.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`}>
          {section.category && (
            <Typography
              variant="caption"
              component={Category as any}
              style={{ marginTop: sectionIndex === 0 ? 0 : 16 }}
            >
              {section.category}
            </Typography>
          )}
          {section.items.map((item, index) => (
            item.include && (
              <MenuItem
                key={`item-${sectionIndex}-${index}`}
                onClick={item.onClick}
                component={MenuItemStyled as any}
                selected={item.selected}
              >
                <ListItemIcon component={Icon as any}><>{item.icon}</></ListItemIcon>
                <ListItemText primaryTypographyProps={{ component: Primary as any }} primary={item.label} />
              </MenuItem>
            )
          ))}
        </div>
      ))}
    </MenuList>
  )
}

export default SideMenuItems