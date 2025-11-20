import React from 'react'
import Button from 'design-library/atoms/buttons/button/button'
import ConfirmDialog from 'design-library/molecules/dialogs/confirm-dialog/confirm-dialog'
import type { AlertColor } from '@mui/material/Alert'

type ConfirmButtonProps = {
  // Button props
  label?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  disabled?: boolean
  completed?: boolean // when false, show loading spinner like other buttons

  // Dialog props
  dialogMessage: React.ReactNode
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  alertMessage?: React.ReactNode
  alertSeverity?: AlertColor

  // Callbacks
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
  onOpenChange?: (open: boolean) => void
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  label,
  type = 'button',
  variant = 'contained',
  color = 'primary',
  disabled,
  completed = true,
  dialogMessage,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  alertMessage,
  alertSeverity = 'warning',
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

  const handleConfirm = async () => {
    await onConfirm?.()
  }

  const handleCancel = () => {
    onCancel?.()
  }

  return (
    <>
      <Button
        type={type}
        variant={variant}
        color={color}
        label={label}
        disabled={disabled}
        onClick={openDialog}
      />
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
