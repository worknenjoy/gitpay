import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import { injectStripe } from 'react-stripe-elements';

import CardSection from './card-section';
import UserSection from './user-section';
import Button from "material-ui/es/Button/Button";
import { FormControl, FormHelperText } from 'material-ui/Form';

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
    this.onChange = this.onChange.bind(this);

    this.state = {
      fullname: null,
      email: null,
      error: {
        fullname: false,
        email: false
      }
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    if(!this.state.fullname) {
      this.setState({error: {fullname: true}});
    } else {
      this.setState({error: {fullname: false}});
    }

    if(!this.state.email) {
      this.setState({error: {email: true}});
    } else {
      this.setState({error: {email: false}});
    }

    this.props.stripe.createToken({name: this.state.fullname}).then(({token}) => {
      console.log('Received Stripe token:', token);
    });

    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  }

  onChange(ev) {
    let formData = {};
    formData[ev.target.name] = ev.target.value;
    this.setState(formData);
  }

  componentWillMount() {

  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} onChange={this.onChange} style={{marginTop: 20, marginBottom: 20, width: '100%'}}>
          <Grid item xs={12} style={{marginBottom: 20}}>
            <UserSection error={this.state.error} />
          </Grid>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <CardSection />
            </Grid>
            <Grid item xs={12}>
              <div style={styles.formActions}>
                <Button color="primary" onClick={this.props.onClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="raised" color="secondary">
                  {`Pagar R$ ${this.props.price}`}
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
