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
      price: null,
      open: false
    }
    this.onClose = this.onClose.bind(this);

  }

  componentWillMount() {
    this.setState({price: this.props.price, open: this.props.open});
  }

  componentWillReceiveProps(prop){
    this.setState({price: prop.price, open: prop.open});
  }

  onClose() {
    this.setState({
      open: false
    })
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
        transition={Transition}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Realizar pagamento
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Preecha os dados do cartão para efetuar o pagamento
          </DialogContentText>
          <StripeCheckout price={this.props.price} onClose={this.props.onClose} task={this.props.task} />
        </DialogContent>
      </Dialog>
    )
  }

}

export default PaymentDialog;
