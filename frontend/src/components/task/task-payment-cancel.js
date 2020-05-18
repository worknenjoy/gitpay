import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button
} from '@material-ui/core'

const TaskPaymentCancel = ({ cancelPaypalConfirmDialog, handlePayPalDialogClose, handleCancelPaypalPayment }) => {
  return (
    <Dialog
      open={ cancelPaypalConfirmDialog }
      onClose={ handlePayPalDialogClose }
      aria-labelledby='form-dialog-title'
    >
      <div>
        <DialogTitle id='form-dialog-title'>
          <FormattedMessage id='task.bounties.details.paypal' defaultMessage='Are you sure you want to cancel this pre-payment?' />
        </DialogTitle>
        <DialogContent>
          <Typography type='caption'>
            <FormattedMessage id='task.bounties.cancel.paypal.caution' defaultMessage='If you cancel this payment, your pre-approved payment will be canceled and the balance will be canceled from this issue' />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handlePayPalDialogClose } color='primary'>
            <FormattedMessage id='task.actions.cancel' defaultMessage='Cancel' />
          </Button>
          <Button onClick={ (e) => handleCancelPaypalPayment(e) } variant='contained' color='secondary' >
            <FormattedMessage id='task.actions.cancelPayment' defaultMessage='Confirm cancelation of pre-authorized payment' />
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}

export default TaskPaymentCancel
