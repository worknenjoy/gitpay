import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card, { CardContent, CardMedia } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Chip from 'material-ui/Chip'
import { FormControl } from 'material-ui/Form'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import Collapse from 'material-ui/transitions/Collapse'

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
      samplePrice: 0
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
            <CardMedia
              className={ classes.cover }
              image={ paymentIcon }
              title='Realize o pagamento pela tarefa'
            />
            <div className={ classes.details }>
              <CardContent className={ classes.content }>
                <Typography variant='headline'>Adicionar uma recompensa para esta tarefa</Typography>
                <Typography variant='subheading' color='textSecondary'>
                  Realize um pagamento por esta tarefa para que alguém possa desenvolvê-la e receber o pagamento como recompensa.
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
                    <InputLabel htmlFor='adornment-amount'>Valor</InputLabel>
                    <Input
                      id='adornment-amount'
                      startAdornment={ <InputAdornment position='start'>$</InputAdornment> }
                      placeholder='Insira um valor'
                      type='number'
                      inputProps={ { 'min': 0 } }
                      defaultValue={ this.state.currentPrice }
                      value={ this.state.currentPrice }
                      onChange={ this.handleInputChange }
                    />
                  </FormControl>
                  <Button style={ { marginLeft: 20 } } disabled={ !this.state.currentPrice } onClick={ () => this.handlePayment('PaymentDialog') } variant='raised' color='primary' className={ classes.btnPayment }>
                    { `Pagar $ ${this.state.currentPrice} com cartão de crédito` }
                  </Button>
                  <Button disabled={ !this.state.currentPrice } onClick={ () => this.handlePayment('PaypalPaymentDialog') } variant='raised' color='primary' className={ classes.btnPayment }>
                    { `Pagar $ ${this.state.currentPrice} com Paypal` }
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
