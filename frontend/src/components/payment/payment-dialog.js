import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import StripeCheckout from '../checkout/stripe-checkout';


function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class PaymentDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: null
    }
  }

  componentWillMount() {
    this.setState({ price: this.props.price });
  }

  componentWillReceiveProps(prop){
    this.setState({ price: prop.price });
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        transition={Transition}
        onClose={this.props.onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Realizar pagamento
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Preecha os dados do cartão para efetuar o pagamento
          </DialogContentText>
          <DialogContentText>
            <StripeCheckout { ...this.props } />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    )
  }

}

export default PaymentDialog;
