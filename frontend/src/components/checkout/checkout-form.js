import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { injectStripe } from 'react-stripe-elements';
import { withRouter} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

import CardSection from './card-section';
import UserSection from './user-section';
import Button from "material-ui/es/Button/Button";
import Notification from '../notification/notification';

import api from '../../consts';
import axios from 'axios';
import Auth from '../../modules/auth';

const styles = theme => ({
  formActions: {
    marginTop: 20,
    marginBottom: 10,
    float: 'right'
  },
  cardElements: {

  }
});

class CheckoutForm extends Component {

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);

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
          axios.put(api.API_URL + '/tasks/update', {
            id: this.props.task,
            value: this.props.price,
            Orders: [{
              source_id: token.id,
              currency: 'BRL',
              amount: this.props.itemPrice,
              email: this.state.email,
              userId: this.state.userId
            }]
          }).then((response) => {
            this.props.onClose();
            console.log(this.props);
            this.props.history.replace({pathname: `/task/${this.props.match.params.id}/orders`, state: {
              notification: {
                open: true,
                message: "O seu pagamento foi realizado com sucesso"
              }
            }});
          }).catch((error) => {
            console.log(error);
            this.setState({
              error: {
                payment: true,
                message: "Erro ao atualizar o pedido"
              },
              paymentRequested: false
            })
          });
        } catch(e) {
          console.log('error', e);
          this.setState({
            error: {
              payment: true,
              message: "Erro ao processar o pagamento do cartão de crédito"
            },
            paymentRequested: false
          })
        };
      } else {
        this.setState({
          error: {
            payment: true,
            message: "Erro na criação do token"
          },
          paymentRequested: false
        })
      }
    }).catch((e) => {
      console.log('error to create token');
      console.log(e);
      this.setState({
        error: {
          payment: true,
          message: "Erro na criação do token"
        },
        paymentRequested: false
      })
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
      error: {
        payment: false
      }
    });
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
    const { classes } = this.props;

    return (
      <div>
        <Notification message={this.state.error.message || "Tivemos um erro ao processar seu pagamento"} open={this.state.error.payment} onClose={this.handleCloseNotification} />
        <form onSubmit={this.handleSubmit} onChange={this.onChange} style={{marginTop: 20, marginBottom: 20, width: '100%'}}>
          <Grid item xs={12} style={{marginBottom: 20}}>
            { logged ? <div><Typography variant="caption"> Você está logado como </Typography><Typography variant="subheading">{this.state.fullname}({this.state.email})</Typography></div>  : <UserSection error={this.state.error}/>}
          </Grid>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <div className={classes.cardElements}>
                <CardSection />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.formActions}>
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
      </div>
    );
  }
}

CheckoutForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(injectStripe(CheckoutForm)));
