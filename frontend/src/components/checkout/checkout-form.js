import React, { Component } from 'react';
import { injectStripe } from 'react-stripe-elements';

import CardSection from './card-section';
import Button from "material-ui/es/Button/Button";

const styles = {
  formActions: {
    marginTop: 20,
    marginBottom: 10,
    float: 'right'
  }
}

class CheckoutForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(ev) {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken({name: 'Jenny Rosen'}).then(({token}) => {
      console.log('Received Stripe token:', token);
    });

    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  }

  componentWillMount() {
    console.log('checkout-form props');
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} style={{marginTop: 20, marginBottom: 20}}>
          <CardSection />
          <div style={styles.formActions}>
            <Button color="primary" onClick={this.props.onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="raised" color="secondary">
              {`Pagar R$ ${this.props.price}`}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
