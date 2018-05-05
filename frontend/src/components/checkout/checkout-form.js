import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import { injectStripe } from 'react-stripe-elements';

import CardSection from './card-section';
import UserSection from './user-section';
import Button from "material-ui/es/Button/Button";
import Notification from '../notification/notification';

import api from '../../consts';
import axios from 'axios';

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
    this.handleCloseNotification = this.handleCloseNotification.bind(this);

    this.state = {
      fullname: null,
      email: null,
      error: {
        fullname: false,
        email: false,
        payment: false
      },
      paymentRequested: false
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();

    this.setState({paymentRequested: true});

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
      //console.log('Received Stripe token:', token);
      if(token) {
        axios.put(api.API_URL + '/tasks/update', {
          id: this.props.task,
          value: this.props.price,
          order: {
            source_id: token.id,
            currency: 'BRL',
            amount: this.props.price,
            email: this.state.email
          }
        }).then((response) => {
          console.log(response);
          window.location.assign(`/#/tasks/${this.props.task}/orders/${orderId}`);
        }).catch((error) => {
          console.log(error);
        });

      } else {
        this.setState({
          payment: {
            error: true
          },
          paymentRequested: false
        })
      }
    });

    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  }

  onChange(ev) {
    let formData = {};
    formData[ev.target.name] = ev.target.value;
    this.setState(formData);
  }

  handleCloseNotification() {
    this.setState({
      payment: {
        error: false
      }
    });
  }

  componentWillMount() {

  }

  render() {
    return (
      <div>
        <Notification message="Tivemos um erro ao processar seu pagamento" open={this.state.error.payment} onClose={this.handleCloseNotification} />
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
                <Button type="submit" variant="raised" color="secondary" disabled={this.state.paymentRequested}>
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
