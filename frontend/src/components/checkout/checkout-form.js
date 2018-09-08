import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import { injectStripe } from 'react-stripe-elements'

import CardSection from './card-section'
import UserSection from './user-section'
import Button from 'material-ui/Button'

class CheckoutForm extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChange = this.onChange.bind(this)

    this.state = {
      email: null,
      fullname: null,
      authenticated: false,
      userId: null,
      error: {
        fullname: false,
        email: false,
        payment: false,
        message: 'loading'
      },
      paymentRequested: false
    }
  }

  handleSubmit (ev) {
    ev.preventDefault()

    this.setState({ paymentRequested: true })

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    if (!this.state.fullname) {
      this.setState({ error: { fullname: true } })
      return
    }
    else {
      this.setState({ error: { fullname: false } })
    }

    if (!this.state.email) {
      this.setState({ error: { email: true } })
    }
    else {
      this.setState({ error: { email: false } })
    }
    if (!this.props.stripe) {
      return
    }
    this.props.stripe
      .createToken({ name: this.state.fullname })
      .then(({ token }) => {
        if (token) {
          try {
            this.props.onPayment({
              id: this.props.task,
              Orders: [
                {
                  source_id: token.id,
                  currency: 'usd',
                  provider: 'stripe',
                  amount: this.props.itemPrice,
                  email: this.state.email,
                  userId: this.state.userId
                }
              ]
            })
            this.props.onClose()
          }
          catch (e) {
            this.props.addNotification(
              'Erro ao processar o pagamento do cartão de crédito'
            )
            this.setState({
              paymentRequested: false
            })
          }
        }
        else {
          this.props.addNotification('Erro no pagamento')
          this.setState({
            paymentRequested: false
          })
        }
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log('error to create token')
        // eslint-disable-next-line no-console
        console.log(e)
        this.props.addNotification('Erro no pagamento')
        this.setState({
          paymentRequested: false
        })
      })

    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  }

  onChange (ev) {
    ev.preventDefault()
    let formData = {}
    formData[ev.target.name] = ev.target.value
    this.setState(formData)
  }

  componentDidMount () {
    const { user } = this.props

    if (user && user.id) {
      this.setState({
        authenticated: true,
        fullname: user.name,
        email: user.email,
        userId: user.id
      })
    }
  }

  render () {
    const logged = this.state.authenticated

    return (
      <form
        onSubmit={ this.handleSubmit }
        onChange={ this.onChange }
        style={ { marginTop: 20 } }
      >
        <Grid container spacing={ 24 }>
          <Grid item xs={ 12 } style={ { marginBottom: 20 } }>
            { logged ? (
              <div>
                <Typography variant='caption'>
                  Você está logado como
                </Typography>
                <Typography variant='subheading'>
                  { (this.state.fullname && this.state.email) ? (
                    `${this.state.fullname} (${this.state.email})`
                  ) : (
                    'Não foi possível obter os dados do usuário logado'
                  ) }
                </Typography>
              </div>
            ) : (
              <UserSection error={ this.state.error } />
            ) }
          </Grid>
          <Grid item xs={ 12 }>
            <CardSection { ...this.props } />
          </Grid>
          <Grid item xs={ 12 }>
            <div style={ { marginTop: 20, marginBottom: 0, float: 'right' } }>
              <Button color='primary' onClick={ this.props.onClose }>
                Cancelar
              </Button>
              <Button
                type='submit'
                variant='raised'
                color='secondary'
                disabled={ this.state.paymentRequested }
              >
                { `Pagar $ ${this.props.itemPrice}` }
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    )
  }
}

CheckoutForm.propTypes = {
  stripe: PropTypes.object,
  onPayment: PropTypes.func,
  task: PropTypes.any,
  onClose: PropTypes.func,
  addNotification: PropTypes.func,
  itemPrice: PropTypes.any,
  user: PropTypes.object
}

export const CheckoutFormPure = CheckoutForm
export default injectStripe(CheckoutForm)
