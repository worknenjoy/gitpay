import React from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { MoreVert as MoreIcon, Visibility as VisibilityIcon } from '@mui/icons-material'

type ActionsMenuProps = {
  actions: {
    children: React.ReactNode
    onClick: () => void
    icon?: React.ReactNode
  }[]
}

export const ActionsMenu = ({ actions }: ActionsMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <div className="actions-menu">
      <IconButton onClick={handleOpenMenu}>
        <MoreIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
          },
        }}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.onClick()
              handleCloseMenu() // fecha o menu ao clicar em qualquer item
            }}
          >
            <ListItemIcon>{action.icon || <VisibilityIcon fontSize="small" />}</ListItemIcon>
            <ListItemText primary={action.children} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default ActionsMenu
