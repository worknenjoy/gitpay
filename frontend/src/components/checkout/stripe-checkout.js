import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './checkout-form';

class StripeCheckout extends Component {

  constructor(props) {
    super(props);
    this.state = {stripe: null};
  }

  componentWillMount() {
    // componentDidMount only runs in a browser environment.
    // In addition to loading asynchronously, this code is safe to server-side render.

    // You can inject a script tag manually like this,
    // or you can use the 'async' attribute on the Stripe.js v3 <script> tag.
    //const stripeJs = document.createElement('script');
    //stripeJs.src = 'https://js.stripe.com/v3/';
    //stripeJs.async = true;
    //stripeJs.onload = () => {
      // The setTimeout lets us pretend that Stripe.js took a long time to load
      // Take it out of your production code!
      //this.setState({
        //stripe: window.Stripe('pk_test_pBA57lmPZbGhidkUUphTZZdB'),
      //});
    //}
    //document.body && document.body.appendChild(stripeJs);
  }

  render() {
    return (
        <CheckoutForm {...this.props} />
    );
  }
}

export default StripeCheckout;
