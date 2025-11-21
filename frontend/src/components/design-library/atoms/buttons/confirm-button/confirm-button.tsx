import React from 'react'
import { AlertColor, ListItemText, ListItemIcon } from '@mui/material'
import Button from 'design-library/atoms/buttons/button/button'
import ConfirmDialog from 'design-library/molecules/dialogs/confirm-dialog/confirm-dialog'

type ConfirmButtonProps = {
  // Button props
  label?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  size?: 'small' | 'medium' | 'large'
  startIcon?: React.ReactNode
  component?: React.ElementType
  componentName?: string
  disabled?: boolean
  completed?: boolean // when false, show loading spinner like other buttons

  // Dialog props
  dialogMessage: React.ReactNode
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  alertMessage?: React.ReactNode
  alertSeverity?: AlertColor

  // Callbacks
  onConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onCancel?: () => void
  onOpenChange?: (open: boolean) => void
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  label,
  type = 'button',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  component,
  componentName,
  disabled,
  completed = true,
  dialogMessage,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  alertMessage,
  alertSeverity = 'warning',
  startIcon,
  onConfirm,
  onCancel,
  onOpenChange
}) => {
  const [open, setOpen] = React.useState(false)

  const openDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setOpen(true)
    onOpenChange?.(true)
  }

  const handleClose = () => {
    setOpen(false)
    onOpenChange?.(false)
  }

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onConfirm?.(e)
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const CustomComponent = component

  const Component = component
    ? () => (
        <CustomComponent onClick={openDialog}>
          {componentName === 'MenuItem' ? (
            <>
              <ListItemIcon>{startIcon}</ListItemIcon>
              <ListItemText primary={label} />
            </>
          ) : (
            <>
              <span style={{ display: 'inline-block', marginRight: 8 }}>{startIcon}</span>
              <span>{label}</span>
            </>
          )}
        </CustomComponent>
      )
    : () => (
        <Button
          type={type}
          variant={variant}
          color={color}
          size={size}
          label={label}
          startIcon={startIcon}
          disabled={disabled}
          onClick={openDialog}
          completed={completed}
        />
      )
  return (
    <>
      <Component />
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        message={dialogMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        alertMessage={alertMessage}
        alertSeverity={alertSeverity}
        completed={completed}
      />
    </>
  )
}

export default ConfirmButton
