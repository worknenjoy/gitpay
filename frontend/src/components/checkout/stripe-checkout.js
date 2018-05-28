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
        <CheckoutForm {...this.props} />
      </Elements>
    );
  }
}

export default StripeCheckout;
