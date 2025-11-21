import React from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Button } from '@mui/material'
import { MoreVert as MoreIcon, Visibility as VisibilityIcon } from '@mui/icons-material'
import ConfirmButton from 'design-library/atoms/buttons/confirm-button/confirm-button'

type ActionsMenuProps = {
  actions: {
    children: React.ReactNode
    onClick: () => void
    icon?: React.ReactNode
    confirm?: {
      dialogMessage?: string | React.ReactNode,
      alertMessage?: string | React.ReactNode
    }
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
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.onClick()
              handleCloseMenu()
            }}
            { ...action.confirm ?
              { component: 
                () => 
                  <ConfirmButton
                    type="button"
                    dialogMessage={action.confirm.dialogMessage}
                    alertMessage={action.confirm.alertMessage}
                    label={action.children}
                    onConfirm={action.onClick}
                    variant="text"
                    size="small"
                    startIcon={action.icon || <VisibilityIcon fontSize="small" />}
                    component={MenuItem}
                    componentName={'MenuItem'}
                  />
                } : {}
            }
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
