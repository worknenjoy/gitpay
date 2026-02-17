import React, { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'

import Button from '../../../atoms/buttons/button/button'

type ConfirmTextDialogProps = {
  open: boolean
  title: React.ReactNode
  subtitle?: React.ReactNode
  textAreaName: string
  textAreaLabel?: React.ReactNode
  actionLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  initialValue?: string
  rows?: number
  onValueChange?: (value: string) => void
  onConfirm?: (value: string) => void
  onCancel?: () => void
  handleClose?: () => void
}

export default function ConfirmTextDialog({
  open,
  title,
  subtitle,
  textAreaName,
  textAreaLabel,
  actionLabel = 'Save',
  cancelLabel = 'Cancel',
  initialValue = '',
  rows = 5,
  onValueChange,
  onConfirm,
  onCancel,
  handleClose
}: ConfirmTextDialogProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (open) setValue(initialValue)
  }, [open, initialValue])

  const canConfirm = useMemo(() => value.trim().length > 0, [value])

  const onClickCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onCancel?.()
    handleClose?.()
  }

  const onClickConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!canConfirm) return
    onConfirm?.(value)
    handleClose?.()
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="confirm-text-dialog-title">
      <DialogTitle id="confirm-text-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {subtitle && (
          <Typography variant="subtitle2" gutterBottom>
            {subtitle}
          </Typography>
        )}
        <TextField
          autoFocus
          fullWidth
          name={textAreaName}
          label={textAreaLabel}
          multiline
          rows={rows}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            onValueChange?.(e.target.value)
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickCancel} variant="outlined" color="secondary" label={cancelLabel} />
        <Button
          onClick={onClickConfirm}
          variant="contained"
          color="primary"
          label={actionLabel}
          disabled={!canConfirm}
        />
      </DialogActions>
    </Dialog>
  )
}
