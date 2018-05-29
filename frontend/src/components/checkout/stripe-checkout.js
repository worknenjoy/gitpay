import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './checkout-form';

class StripeCheckout extends Component {

  constructor(props) {
    super(props);
    this.state = {stripe: null};
  }

  componentWillMount() {
    if (window.Stripe) {
      this.setState({stripe: 'pk_test_pBA57lmPZbGhidkUUphTZZdB'});
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        console.log('loaded');
        this.setState({stripe: 'pk_test_pBA57lmPZbGhidkUUphTZZdB'});
      });
    }
  }

  render() {
    return (
      <StripeProvider apiKey={this.state.stripe}>
        <Elements>
          <CheckoutForm {...this.props} />
        </Elements>
      </StripeProvider>
    );
  }
}

export default StripeCheckout;
