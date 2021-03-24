import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={0} variant="outlined" {...props} />;
}

export default function PaymentRefund({ open, handleClose, orderId, onRefund, listOrders }) {
  const classes = useStyles();

  const handleRefund = async (event) => {
    event.preventDefault()
    orderId && await onRefund(orderId)
    handleClose()
    listOrders()
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
            <FormattedMessage id='user.profile.payments.refund.confirm' defaultMessage='Are you sure you want to refund?' />
          </Typography>
          <Alert severity="warning">
            <FormattedMessage id='user.profile.payments.refund.message' defaultMessage='You will be refunded with the value paid for the issue, excluding fees' /> 
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
  );
}
