import { MenuList, Typography, ListItemIcon } from '@mui/material'
import React from 'react'
import { MenuItemStyled, Primary, Category } from './side-menu-items.styles'

const SideMenuItems = ({ menuItems }) => {
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
          {section.items.map(
            (item, index) =>
              item.include && (
                <MenuItemStyled
                  key={`item-${sectionIndex}-${index}`}
                  onClick={item.onClick}
                  selected={item.selected}
                >
                  <ListItemIcon
                    sx={(theme) => ({
                      color: theme.palette.getContrastText(theme.palette.primary.main)
                    })}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <Primary primary={item.label} />
                </MenuItemStyled>
              )
          )}
        </div>
      ))}
    </MenuList>
  )
}

export default SideMenuItems
