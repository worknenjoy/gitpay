import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import MotorcycleIcon from '@material-ui/icons/Motorcycle'
import DriveEtaIcon from '@material-ui/icons/DriveEta'
import CheckIcon from '@material-ui/icons/Check'

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
  Dialog,
  DialogTitle,
  DialogContent,
  Grid
} from '@material-ui/core'

const paymentIcon = require('../../images/payment-icon-alt.png')

import PaymentDialog from '../payment/payment-dialog'
import PaypalPaymentDialog from '../payment/paypal-payment-dialog'

const fee = { 'open source': 1.08, 'private': 1.18, 'full': 1.30 }

class TaskPaymentForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      price: 0,
      orderPrice: 0,
      samplePrice: 0,
      plan: null,
      priceAfterFee () {
        return this.plan && Number((parseInt(this.price) * fee[this.plan]).toFixed(2))
      },
      checkPlan (plan) {
        if (!plan || !this.plan) return false
        return this.plan === plan
      }
    }
  }

  componentDidMount () {
    this.props.task && this.props.task.data.private ? this.handlePlan('private') : this.handlePlan('open source')
  }

  formatCurrency = (amount) => {
    return (new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumSignificantDigits: 4
    }).format(amount))
  }

  pickTaskPrice = (price) => {
    this.setState({
      price: price,
    })
  }

  handleInputChange = (e) => {
    this.setState({ price: e.target.value })
  }

  handlePayment = (value) => {
    this.props.openDialog(value)
  }

  handlePlan = (plan) => {
    this.setState({
      plan
    })
  }

  render () {
    const { classes } = this.props

    return (
      <div>
        <Dialog 
          open={ this.props.open } onClose={this.props.onClose}
          aria-labelledby='form-dialog-title'
          maxWidth='md'
        >
          <DialogTitle id='form-dialog-title'>
            <FormattedMessage id='task.payment.headline' defaultMessage='Payment' />
          </DialogTitle>
          <DialogContent>
            <Card className={ classes.card }>
              <div className={ classes.details }>
                <CardContent className={ classes.content }>
                  <Typography variant='h5'>
                    <FormattedMessage id='task.payment.headline.bounty.add' defaultMessage='Add a bounty for this task' />
                  </Typography>
                  <Typography variant='body1' color='textSecondary'>
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
                            defaultValue={ this.state.price }
                            value={ this.state.price }
                            onChange={ this.handleInputChange }
                          />
                        ) }
                      </FormattedMessage>
                    </FormControl>
                  </form>
                  <Grid
                    className={ classes.planContainer }
                    container
                    alignItems='center'
                    justify='center'
                    spacing={ 0 }
                    xs={ 0 }
                    md={ 12 }
                    lg={ 12 } >
                    { this.props.plan === 'open source' ? (
                      <Grid item className={ classes.planGridItem }>
                        <Card className={ classes.planGrid }
                          { ...this.state.checkPlan('open source') }
                        >

                          <CardContent className={ classes.planGridContent }>
                            <div className={ classes.planButton }>
                              <MotorcycleIcon color={ `${this.state.checkPlan('open source') ? 'primary' : 'disabled'}` } className={ classes.planIcon } />
                            </div>
                            <Typography align='center' color='textPrimary' variant='h5'>
                              <FormattedMessage id='actions.task.payment.plan.percentagefee' defaultMessage='{fee}% fee' values={ { fee: '8' } } />
                            </Typography>
                            <Typography align='center' color='textSecondary' variant='h6' gutterBottom>
                              <FormattedMessage id='actions.task.payment.plan.opensource' defaultMessage='Open Source' />
                            </Typography>
                            <Typography align='center' variant='caption'gutterBottom>
                              <FormattedMessage id='actions.task.payment.plan.opensource.info' defaultMessage='For Open Source Project' />
                            </Typography>

                            <div className={ classes.planBullets }

                            >
                              <Typography>
                                <CheckIcon className={ classes.checkIcon } fontSize='small' color='primary' />
                                <FormattedMessage id='actions.task.payment.plan.bullet.public' defaultMessage='For Public Projects' />
                              </Typography>

                              <Typography>
                                <CheckIcon className={ classes.checkIcon } fontSize='small' color='primary' />
                                <FormattedMessage id='actions.task.payment.plan.bullet.basic' defaultMessage='Basic Campaign' />
                              </Typography>
                            </div>
                          </CardContent>

                        </Card>
                      </Grid>
                    ) : (
                      <Grid item className={ classes.planGridItem } >
                        <Card className={ classes.planGrid }
                          { ...this.state.checkPlan('private') }
                        >

                          <CardContent className={ classes.planGridContent }>
                            <div className={ classes.planButton }>
                              <DriveEtaIcon color={ `${this.state.checkPlan('private') ? 'primary' : 'disabled'}` } className={ classes.planIcon } />
                            </div>
                            <Typography align='center' color='textPrimary' variant='h5'>
                              <FormattedMessage id='actions.task.payment.plan.percentagefee' defaultMessage='{fee}% fee' values={ { fee: '18' } } />
                            </Typography >
                            <Typography align='center' color='textSecondary' variant='h6'>
                              <FormattedMessage id='actions.task.payment.plan.private' defaultMessage='Private Projects' />
                            </Typography>
                            <Typography align='center' variant='caption'gutterBottom>
                              <FormattedMessage id='actions.task.payment.plan.private.info' defaultMessage='For Private Project' />
                            </Typography>

                            <div className={ classes.planBullets }

                            >
                              <Typography>
                                <CheckIcon className={ classes.checkIcon } fontSize='small' color='primary' />
                                <FormattedMessage id='actions.task.payment.plan.bullet.private' defaultMessage='Private Projects' />
                              </Typography>

                              <Typography>
                                <CheckIcon className={ classes.checkIcon } fontSize='small' color='primary' />
                                <FormattedMessage id='actions.task.payment.plan.bullet.basic' defaultMessage='Basic Campaign' />
                              </Typography>
                            </div>
                          </CardContent>

                        </Card>
                      </Grid>
                    ) }
                  </Grid>

                  <Button
                    style={ { marginLeft: 20 } }
                    disabled={ !this.state.priceAfterFee() }
                    onClick={ () => this.handlePayment('PaymentDialog') }
                    variant='contained'
                    color='primary'
                    className={ classes.btnPayment }>
                    <FormattedMessage id='task.payment.creditcard.action' defaultMessage='Pay {amount} with Credit Card' values={ {
                      amount: this.formatCurrency(this.state.priceAfterFee())
                    } } />
                  </Button>
                  <Button
                    disabled={ !this.state.priceAfterFee() }
                    onClick={ () => this.handlePayment('PaypalPaymentDialog') }
                    variant='contained'
                    color='primary'
                    className={ classes.btnPayment }
                  >
                    <FormattedMessage id='task.payment.paypal.action' defaultMessage='Pay {amount} with PayPal' values={ {
                      amount: this.formatCurrency(this.state.priceAfterFee())
                    } } />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </DialogContent>
        </Dialog>
        <PaymentDialog
          open={ this.props.dialog.open && this.props.dialog.target === 'PaymentDialog' }
          onClose={ this.props.closeDialog }
          addNotification={ this.props.addNotification }
          onPayment={ this.props.updateTask }
          price={ this.state.price }
          formatedPrice={ this.formatCurrency(this.state.priceAfterFee()) }
          user={ this.props.user }
          task={ this.props.match.params.id }
          plan={ this.state.plan }
        />

        <PaypalPaymentDialog
          open={ this.props.dialog.open && this.props.dialog.target === 'PaypalPaymentDialog' }
          onClose={ this.props.closeDialog }
          addNotification={ this.props.addNotification }
          onPayment={ this.props.updateTask }
          price={ this.state.price }
          formatedPrice={ this.formatCurrency(this.state.priceAfterFee()) }
          taskId={ this.props.match.params.id }
          createOrder={ this.props.createOrder }
          user={ this.props.user }
          order={ this.props.order }
          plan={ this.state.plan }
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
  task: PropTypes.object,
  order: PropTypes.object,
  plan: PropTypes.string,
  openDialog: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  updateTask: PropTypes.func,
  createOrder: PropTypes.func.isRequired
}

export default TaskPaymentForm
