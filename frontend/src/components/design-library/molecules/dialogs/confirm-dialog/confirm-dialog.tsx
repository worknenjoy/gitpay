import React from 'react'
import { Dialog, DialogContent, DialogActions, Typography } from '@mui/material'
import Alert, { AlertColor } from '@mui/material/Alert'
import Button from '../../../atoms/buttons/button/button'

type ConfirmDialogProps = {
  open: boolean
  message: React.ReactNode
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
  handleClose?: () => void
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  alertMessage?: React.ReactNode
  alertSeverity?: AlertColor
  completed?: boolean
}

export default function ConfirmDialog({
  open,
  handleClose,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  alertMessage,
  alertSeverity = 'warning',
  completed
}: ConfirmDialogProps) {
  const handleConfirmClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (onConfirm) await onConfirm()
    handleClose()
  }

  const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (onCancel) onCancel()
    handleClose()
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogContent>
          <Typography id="confirm-dialog-description">{message}</Typography>
          {alertMessage && (
            <Alert severity={alertSeverity} sx={{ mt: 2 }}>
              {alertMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelClick}
            variant="outlined"
            color="secondary"
            label={cancelLabel}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmClick}
            label={confirmLabel}
            completed={completed}
          />
        </DialogActions>
      </Dialog>
    </div>
  )
}
