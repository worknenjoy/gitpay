import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import StripeCheckout from '../checkout/stripe-checkout';


class PaymentDialog extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="alert-dialog-payment-title"
        aria-describedby="alert-dialog-payment-description"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-payment-title">
          Realizar pagamento
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-payment-description">
            Preecha os dados do cartão para efetuar o pagamento
          </DialogContentText>
          <StripeCheckout {...this.props} />
        </DialogContent>
      </Dialog>
    )
  }

}

export default PaymentDialog;
