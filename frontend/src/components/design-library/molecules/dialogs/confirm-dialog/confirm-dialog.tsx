import React from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material'
import Alert, { AlertColor } from '@mui/material/Alert'

type ConfirmDialogProps = {
  open: boolean
  handleClose: () => void
  message: React.ReactNode
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  alertMessage?: React.ReactNode
  alertSeverity?: AlertColor
}

export default function ConfirmDialog ({
  open,
  handleClose,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  alertMessage,
  alertSeverity = 'warning'
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
        open={ open }
        onClose={ handleClose }
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogContent>
          <Typography id="confirm-dialog-description">
            {message}
          </Typography>
          {alertMessage && (
            <Alert severity={ alertSeverity } sx={{ mt: 2 }}>
              {alertMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleCancelClick } variant="outlined" color="secondary">
            {cancelLabel}
          </Button>
          <Button variant="contained" color="primary" onClick={ handleConfirmClick }>
            {confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
