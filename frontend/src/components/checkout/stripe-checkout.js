import React, { Component } from 'react';
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './checkout-form';

class StripeCheckout extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  //componentWillReceiveProps(prop) {
    //this.setState({price: prop.price});
  //}


  render() {
    return (
      <Elements>
        <CheckoutForm task={this.props.price} price={this.props.price} itemPrice={this.props.itemPrice} onClose={this.props.onClose} />
      </Elements>
    );
  }
}

export default StripeCheckout;
