import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  Collapse
} from '@material-ui/core'

const paymentIcon = require('../../images/payment-icon-alt.png')

import PaymentDialog from '../payment/payment-dialog'
import PaypalPaymentDialog from '../payment/paypal-payment-dialog'

class TaskPaymentForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPrice: 0,
      finalPrice: 0,
      orderPrice: 0,
      samplePrice: 0,
      plan: null,
      finalPrice () {
        return this.plan && Number((parseInt(this.currentPrice) * fee[this.plan]).toFixed(2))
      },
      checkPlan (plan) {
        if (!plan) return false
        return this.plan === plan
      }
    }

  pickTaskPrice = (price) => {
    this.setState({
      currentPrice: price,
      finalPrice: parseInt(price) + parseInt(this.state.orderPrice)
    })
  }

  handleInputChange = (e) => {
    this.setState({ currentPrice: e.target.value })
  }

  handlePayment = (value) => {
    this.props.openDialog(value)
  }

  render () {
    const { classes } = this.props

    return (
      <div>
        <Collapse in={ !!this.props.open }>
          <Card className={ classes.card }>
            <FormattedMessage id='task.payment.headline.bounty.create' defaultMessage='Create a bounty for this task'>
              { (msg) => (
                <CardMedia
                  className={ classes.cover }
                  image={ paymentIcon }
                  title={ msg }
                />
              ) }
            </FormattedMessage>
            <div className={ classes.details }>
              <CardContent className={ classes.content }>
                <Typography variant='h5'>
                  <FormattedMessage id='task.payment.headline.bounty.add' defaultMessage='Add a bounty for this task' />
                </Typography>
                <Typography variant='subheading' color='textSecondary'>
                  <FormattedMessage id='task.payment.form.message.subheading' defaultMessage='Create a bounty for this task and who you assign will receive the payment for this bounty' />
                </Typography>
                <div className={ classes.chipContainer }>
                  <Chip
                    label=' $ 20'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskPrice(20) }
                  />
                  <Chip
                    label=' $ 50'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskPrice(50) }
                  />
                  <Chip
                    label=' $ 100'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskPrice(100) }
                  />
                  <Chip
                    label=' $ 150'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskPrice(150) }
                  />
                  <Chip
                    label=' $ 300'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskPrice(300) }
                  />
                </div>
                <form className={ classes.formPayment } action='POST'>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='adornment-amount'>
                      <FormattedMessage id='task.payment.input.amount.value' defaultMessage='Price' />
                    </InputLabel>
                    <FormattedMessage id='task.payment.input.amount' defaultMessage='Price insert a value for this task' >
                      { (msg) => (
                        <Input
                          id='adornment-amount'
                          startAdornment={ <InputAdornment position='start'>$</InputAdornment> }
                          placeholder={ msg }
                          type='number'
                          inputProps={ { 'min': 0 } }
                          defaultValue={ this.state.currentPrice }
                          value={ this.state.currentPrice }
                          onChange={ this.handleInputChange }
                        />
                      ) }
                    </FormattedMessage>
                  </FormControl>
                  <Button
                    style={ { marginLeft: 20 } }
                    disabled={ !this.state.currentPrice }
                    onClick={ () => this.handlePayment('PaymentDialog') }
                    variant='contained'
                    color='primary'
                    className={ classes.btnPayment }>
                    <FormattedMessage id='task.payment.creditcard.action' defaultMessage='Pay $ {amount} with Credit Card' values={ {
                      amount: this.state.currentPrice
                    } } />
                  </Button>
                  <Button
                    disabled={ !this.state.currentPrice }
                    onClick={ () => this.handlePayment('PaypalPaymentDialog') }
                    variant='contained'
                    color='primary'
                    className={ classes.btnPayment }
                  >
                    <FormattedMessage id='task.payment.paypal.action' defaultMessage='Pay $ {amount} with PayPal' values={ {
                      amount: this.state.currentPrice
                    } } />
                  </Button>
                </form>
              </CardContent>
            </div>
          </Card>
        </Collapse>
        <PaymentDialog
          open={ this.props.dialog.open && this.props.dialog.target === 'PaymentDialog' }
          onClose={ this.props.closeDialog }
          addNotification={ this.props.addNotification }
          onPayment={ this.props.updateTask }
          itemPrice={ this.state.currentPrice }
          price={ this.state.finalPrice }
          user={ this.props.user }
          task={ this.props.match.params.id }
        />

        <PaypalPaymentDialog
          open={ this.props.dialog.open && this.props.dialog.target === 'PaypalPaymentDialog' }
          onClose={ this.props.closeDialog }
          addNotification={ this.props.addNotification }
          onPayment={ this.props.updateTask }
          itemPrice={ this.state.currentPrice }
          price={ this.state.finalPrice }
          task={ this.props.match.params.id }
          createOrder={ this.props.createOrder }
          user={ this.props.user }
          order={ this.props.order }
        />
      </div>
    )
  }
}

TaskPaymentForm.propTypes = {
  open: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  dialog: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  user: PropTypes.object,
  order: PropTypes.object,
  openDialog: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  updateTask: PropTypes.func,
  createOrder: PropTypes.func.isRequired
}

export default TaskPaymentForm
