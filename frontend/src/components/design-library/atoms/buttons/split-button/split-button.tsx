import React from 'react'
import { ButtonGroup, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import type { ButtonProps as MUIButtonProps } from '@mui/material/Button'
import Button from '../button/button'
import { MenuItemLabel, MenuItemDescription } from './split-button.styles'

export type SplitButtonAction = {
  key: string
  label: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
}

export type SplitButtonProps = {
  label: React.ReactNode
  actions: SplitButtonAction[]
  /** When provided, the button splits into a primary segment (fires this) and a chevron segment (opens the menu). Omit to make the whole button open the menu, as in the "Import" entry point. */
  onDefaultClick?: () => void
  variant?: MUIButtonProps['variant']
  color?: MUIButtonProps['color']
  size?: MUIButtonProps['size']
  completed?: boolean
  disabled?: boolean
}

const SplitButton = ({
  label,
  actions,
  onDefaultClick,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  completed = true,
  disabled = false
}: SplitButtonProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleActionClick = (action: SplitButtonAction) => {
    handleClose()
    action.onClick()
  }

  const isDisabled = disabled || !completed

  return (
    <>
      <ButtonGroup variant={variant} color={color} disabled={isDisabled}>
        {onDefaultClick && (
          <Button
            variant={variant}
            color={color}
            size={size}
            completed={completed}
            disabled={isDisabled}
            onClick={onDefaultClick}
            label={label}
          />
        )}
        <Button
          variant={variant}
          color={color}
          size={size}
          completed={completed}
          disabled={isDisabled}
          onClick={handleOpen}
          aria-haspopup="menu"
          aria-expanded={Boolean(anchorEl)}
          endIcon={<ArrowDropDownIcon />}
          label={onDefaultClick ? undefined : label}
        />
      </ButtonGroup>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.key}
            onClick={() => handleActionClick(action)}
            disabled={action.disabled}
          >
            {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
            <ListItemText
              primary={<MenuItemLabel>{action.label}</MenuItemLabel>}
              secondary={
                action.description && (
                  <MenuItemDescription>{action.description}</MenuItemDescription>
                )
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default SplitButton
