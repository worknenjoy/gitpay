import React from 'react'
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'
import Alert from '@mui/material/Alert'
import { FormattedMessage } from 'react-intl'

const TaskOrderInvoiceConfirm = ({ visible, onClose, offer, onConfirm }) => {
  return (
    <Dialog open={visible} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <FormattedMessage
          id="order.invoice.confirm.text.primary"
          defaultMessage="Confirm order from user offer"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component="div">
            <FormattedMessage
              id="order.invoice.confirm.text.secondary"
              defaultMessage="We will create an order from the user offer"
            />
          </Typography>
        </DialogContentText>
        <Alert severity="info">
          <FormattedMessage
            id="order.invoice.confirm"
            defaultMessage="We will apply the fee of 8% for Open Source Projects"
          />
        </Alert>
        <div>
          <div
            style={{
              margin: '20px 0',
              display: 'flex',
              justifyContent: 'space-between',
              textAlign: 'right'
            }}
          >
            <Typography component="div" gutterBottom>
              <FormattedMessage id="order.value.label" defaultMessage="Value" />
              <Typography variant="h4" gutterBottom>
                ${offer?.value}
              </Typography>
            </Typography>
            <Typography component="div" gutterBottom>
              <FormattedMessage id="order.finalValue.label" defaultMessage="Total with Fees" />
              <Typography variant="h4" gutterBottom>
                ${(offer?.value * 1.08).toFixed(2)}
              </Typography>
            </Typography>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          <FormattedMessage id="order.invoice.actions.cancel" defaultMessage="Cancel" />
        </Button>
        <Button onClick={onConfirm} variant="contained" color="secondary">
          <FormattedMessage id="order.invoice.confirm.action.send" defaultMessage="Accept" />
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskOrderInvoiceConfirm
