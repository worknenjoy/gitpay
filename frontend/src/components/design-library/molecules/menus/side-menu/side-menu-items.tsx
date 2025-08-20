
import { MenuList, Typography, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  menuItem: {
    marginTop: 10,
    marginBottom: 10
  },
  primary: {
    color: theme.palette.primary.contrastText,
    fontSize: '11px !important',
    fontWeight: 500
  },
  icon: {
    marginRight: 5,
    color: theme.palette.primary.contrastText
  },
  category: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "0.58rem",
    textTransform: "uppercase",
    fontWeight: 600,
    marginBottom: 16,
    paddingLeft: 16
  }
}))

const SideMenuItems = ({
  menuItems
}) => {
  const classes = useStyles()
  return (
    <MenuList>
      {menuItems.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`}>
          {section.category && (
            <Typography
              variant="caption"
              className={classes.category}
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
                className={classes.menuItem}
                selected={item.selected}
              >
                <ListItemIcon className={classes.icon}><>{item.icon}</></ListItemIcon>
                <ListItemText classes={{ primary: classes.primary }} primary={item.label} />
              </MenuItem>
            )
          ))}
        </div>
      ))}
    </MenuList>
  )
}

export default SideMenuItems