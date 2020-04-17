import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Grid,
  Typography,
  Button,
} from '@material-ui/core'
import { injectStripe } from 'react-stripe-elements'

import CardSection from './card-section'
import UserSection from './user-section'

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
              Orders: {
                source_id: token.id,
                currency: 'usd',
                provider: 'stripe',
                amount: this.props.price,
                email: this.state.email,
                userId: this.state.userId,
                plan: this.props.plan
              }
            })
            this.props.onClose()
          }
          catch (e) {
            this.props.addNotification(
              'payment.message.error'
            )
            this.setState({
              paymentRequested: false
            })
          }
        }
        else {
          this.props.addNotification('payment.message.error')
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
        this.props.addNotification('payment.message.error')
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
    this.setState({ paymentRequested: false })
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
    const { user } = this.props

    return (
      <form
        onSubmit={ this.handleSubmit }
        onChange={ this.onChange }
        style={ { marginTop: 20 } }
      >
        <Grid container spacing={ 3 }>
          <Grid item xs={ 12 } style={ { marginBottom: 20 } }>
            { logged ? (
              <div>
                { user && user.name ? (
                  <div>
                    <Typography variant='caption'>
                      <FormattedMessage id='checkout.loggedas' defaultMessage='Logged as' />
                    </Typography>
                    <Typography variant='body1'>
                      { `${this.state.fullname} (${this.state.email})` }
                    </Typography>
                  </div>
                ) : (
                  <UserSection error={ this.state.error } name={ this.state.fullname } email={ this.state.email } />
                ) }
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
                <FormattedMessage id='general.actions.cancel' defaultMessage='Cancel' />
              </Button>
              <Button
                type='submit'
                variant='contained'
                color='secondary'
                disabled={ this.state.paymentRequested }
              >
                <FormattedMessage id='checkout.payment.action' defaultMessage='Pay {price}' values={ { price: this.props.formatedPrice } } />
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
  price: PropTypes.any,
  priceAfterFee: PropTypes.string,
  user: PropTypes.object
}

export const CheckoutFormPure = CheckoutForm
export default injectStripe(CheckoutForm)
