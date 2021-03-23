import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

export default function PaymentRefund({ open, handleClose, order }) {
  const classes = useStyles();

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
            Are you sure you want to refund?
          </Typography>
          <Alert severity="warning">
            You will be refunded 
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Refund
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
