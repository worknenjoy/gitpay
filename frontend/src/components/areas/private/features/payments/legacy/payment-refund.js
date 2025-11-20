import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Dialog, DialogContent, DialogActions, Typography } from '@mui/material'
import Alert from '@mui/material/Alert'

export default function PaymentRefund({ open, handleClose, orderId, onRefund, listOrders }) {
  const handleRefund = async (event) => {
    event.preventDefault()
    orderId && (await onRefund(orderId))
    handleClose()
    await listOrders()
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <DialogContent>
          <Typography>
            <FormattedMessage
              id="user.profile.payments.refund.confirm"
              defaultMessage="Are you sure you want to refund?"
            />
          </Typography>
          <Alert severity="warning">
            <FormattedMessage
              id="user.profile.payments.refund.message"
              defaultMessage="You will be refunded with the value paid for the issue, excluding fees"
            />
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleRefund}>
            Refund
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
