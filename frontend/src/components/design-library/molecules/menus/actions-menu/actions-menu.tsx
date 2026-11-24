import React from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import {
  MoreVert as MoreIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon
} from '@mui/icons-material'
import ConfirmButton from 'design-library/atoms/buttons/confirm-button/confirm-button'

export type ActionsMenuAction = {
  children: React.ReactNode
  onClick: () => void
  icon?: React.ReactNode
  disabled?: boolean
  /** Secondary line under the label. */
  description?: React.ReactNode
  /** Marks the current choice (radio-like menus) with a check. */
  selected?: boolean
  /** Renders as a link instead of a button (opens in a new tab). */
  href?: string
  confirm?: {
    dialogMessage?: string | React.ReactNode
    alertMessage?: string | React.ReactNode
  }
}

export type ActionsMenuTriggerProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void
  'aria-haspopup': 'menu'
  'aria-expanded': boolean
  open: boolean
}

type ActionsMenuProps = {
  actions: ActionsMenuAction[]
  /** Replaces the default kebab button. Receives the props to spread on your trigger. */
  renderTrigger?: (props: ActionsMenuTriggerProps) => React.ReactNode
  /** Open the menu on mount (used by stories to show the open state). */
  defaultOpen?: boolean
  /** Menu alignment against the trigger. Defaults to 'right' (kebab style). */
  align?: 'left' | 'right'
  /** Fixed menu width, e.g. for menus with descriptions. */
  menuWidth?: number
  /** Hide the leading icon column (the default eye icon is shown otherwise). */
  hideIcons?: boolean
}

export const ActionsMenu = ({
  actions,
  renderTrigger,
  defaultOpen = false,
  align = 'right',
  menuWidth,
  hideIcons = false
}: ActionsMenuProps) => {
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  React.useEffect(() => {
    if (defaultOpen && triggerRef.current) {
      setAnchorEl(triggerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div className="actions-menu" ref={triggerRef} style={{ display: 'inline-flex' }}>
      {renderTrigger ? (
        renderTrigger({
          onClick: handleOpenMenu,
          'aria-haspopup': 'menu',
          'aria-expanded': open,
          open
        })
      ) : (
        <IconButton onClick={handleOpenMenu}>
          <MoreIcon />
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: align
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: align
        }}
        slotProps={menuWidth ? { paper: { sx: { width: menuWidth } } } : undefined}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            disabled={action.disabled}
            selected={action.selected}
            sx={action.description ? { alignItems: 'flex-start', whiteSpace: 'normal' } : undefined}
            {...(action.href
              ? { component: 'a', href: action.href, target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            onClick={() => {
              action.onClick()
              handleCloseMenu()
            }}
            {...(action.confirm
              ? {
                  component: () => (
                    <ConfirmButton
                      type="button"
                      disabled={action.disabled}
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
                  )
                }
              : {})}
          >
            {!hideIcons && (
              <ListItemIcon sx={action.description ? { mt: 0.5 } : undefined}>
                {action.icon || <VisibilityIcon fontSize="small" />}
              </ListItemIcon>
            )}
            <ListItemText
              primary={action.children}
              secondary={action.description}
              secondaryTypographyProps={{ sx: { fontSize: 12.5, lineHeight: 1.45 } }}
            />
            {action.selected && (
              <CheckIcon fontSize="small" color="primary" sx={{ ml: 1, mt: 0.5 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default ActionsMenu
