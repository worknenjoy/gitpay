import React, { useCallback, useMemo } from 'react'
import { Dialog, DialogContent, DialogActions, Typography } from '@mui/material'
import Alert, { AlertColor } from '@mui/material/Alert'
import Button from '../../../atoms/buttons/button/button'
import Field from 'design-library/atoms/inputs/fields/field/field'

export type confirmField = {
  name: string,
  confirmName: string,
  label: React.ReactNode,
  confirmLabel: React.ReactNode,
  type: string
}

export type confirmFieldValue = {
  [key: string]: string
}

type ConfirmDialogProps = {
  open: boolean
  message: React.ReactNode
  onConfirm?: (e: React.MouseEvent<HTMLButtonElement>, confirmFields?: confirmFieldValue[]) => void
  onCancel?: () => void
  handleClose?: () => void
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  alertMessage?: React.ReactNode
  alertSeverity?: AlertColor
  completed?: boolean
  confirmFields?: confirmField
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
  completed,
  confirmFields
}: ConfirmDialogProps) {

  const [ firstFieldValue, setFirstFieldValue ] = React.useState<string>('')
  const [ secondFieldValue, setSecondFieldValue ] = React.useState<string>('')
  const [ confirmError, setConfirmError ] = React.useState<string | null>(null)

  const handleConfirmClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (confirmFields) {
      if (firstFieldValue !== secondFieldValue) {
        setConfirmError('The confirmation inputs do not match.')
        return
      } else {
        setConfirmError(null)
      }
      const confirmFieldValues = confirmFields ? [{ [confirmFields!.name]: firstFieldValue }, { [confirmFields!.confirmName]: secondFieldValue }] : undefined
      onConfirm?.(event, confirmFieldValues)
    }
    onConfirm?.(event)
    handleClose?.()
  }, [firstFieldValue, secondFieldValue, onConfirm, handleClose, confirmFields])

  const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (onCancel) onCancel()
    handleClose?.()
  }

  const onChangeConfirmFields = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = e.currentTarget
    
    const firstFieldValue = formData.elements[0] as HTMLInputElement
    const secondFieldValue = formData.elements[1] as HTMLInputElement
    
    if (firstFieldValue && secondFieldValue) {
      setFirstFieldValue(firstFieldValue.value)
      setSecondFieldValue(secondFieldValue.value)
    }
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
          {message && <Typography id="confirm-dialog-description">{message}</Typography>}
          { confirmFields && (
            <form onChange={onChangeConfirmFields}>
             <Field
                name={confirmFields.name}
                label={confirmFields.label}
                type={confirmFields.type}
                required
              />
              <Field
                name={confirmFields.confirmName}
                label={confirmFields.confirmLabel}
                type={confirmFields.type}
                required
              />
              {confirmError && (<Typography color="error" variant="body2">{confirmError}</Typography>)}
            </form>
          )}
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
