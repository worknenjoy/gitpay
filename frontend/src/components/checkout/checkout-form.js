import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router-dom';
import { injectStripe } from 'react-stripe-elements';

import CardSection from './card-section';
import UserSection from './user-section';
import Button from "material-ui/Button";

import api from '../../consts';
import axios from 'axios';
import Auth from '../../modules/auth';

class CheckoutForm extends Component {

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      fullname: null,
      email: null,
      authenticated: false,
      userId: null,
      error: {
        fullname: false,
        email: false,
        payment: false,
        message: "loading"
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
        try {
          this.props.onPayment({
            id: this.props.task,
            value: this.props.price,
            Orders: [{
              source_id: token.id,
              currency: 'BRL',
              amount: this.props.itemPrice,
              email: this.state.email,
              userId: this.state.userId
            }]
          });
          this.props.onClose();

        } catch(e) {
          console.log('error', e);
          this.props.addNotification("Erro ao processar o pagamento do cartão de crédito")
          this.setState({
            paymentRequested: false
          })
        };
      } else {
        this.props.addNotification("Erro na criação do token")
        this.setState({
          paymentRequested: false
        })
      }
    }).catch((e) => {
      console.log('error to create token');
      console.log(e);
      this.props.addNotification("Erro na criação do token");
      this.setState({
        paymentRequested: false
      })
    });

    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  }

  onChange(ev) {
    ev.preventDefault();
    let formData = {};
    formData[ev.target.name] = ev.target.value;
    this.setState(formData);
  }

  componentWillMount() {
    const token = Auth.getToken();

    if (token) {
      axios.get(api.API_URL + '/authenticated', {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          this.setState({
            authenticated: response.data.authenticated,
            fullname: response.data.user.name,
            email: response.data.user.email,
            userId: response.data.user.id
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  render() {

    const logged = this.state.authenticated;

    return (
      <form onSubmit={this.handleSubmit} onChange={this.onChange} style={{marginTop: 20}}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{marginBottom: 20}}>
            { logged ? <div><Typography variant="caption"> Você está logado como </Typography><Typography variant="subheading">{this.state.fullname}({this.state.email})</Typography></div>  : <UserSection error={this.state.error}/>}
          </Grid>
          <Grid item xs={12}>
            <CardSection {...this.props} />
          </Grid>
          <Grid item xs={12}>
            <div style={{marginTop: 20, marginBottom: 0, float: 'right'}}>
              <Button color="primary" onClick={this.props.onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="raised" color="secondary" disabled={this.state.paymentRequested}>
                {`Pagar R$ ${this.props.itemPrice}`}
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default withRouter(injectStripe(CheckoutForm));
