import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

import {
  Container,
  Tabs,
  Tab,
  Typography,
  Button,
  Chip,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  Drawer,
  Grid
} from '@material-ui/core'

const paymentIcon = require('../../images/payment-icon-alt.png')

import PaymentDialog from '../payment/payment-dialog'
import PaypalPaymentDialog from '../payment/paypal-payment-dialog'
import { TaskPaymentPlans } from './payment/plans/task-payment-plans'
import { Height } from '@material-ui/icons'

const taskPaymentFormMessages = defineMessages({
  tabPaymentMethodCrediCard: {
    id: 'task.payment.method.card',
    defaultMessage: 'Credit Card'
  },
  tabPaymentMethodPaypal: {
    id: 'task.payment.method.paypal',
    defaultMessage: 'Paypal'
  },
  tabPaymentMethodInvoice: {
    id: 'task.payment.method.invoice',
    defaultMessage: 'Invoice'
  },
})

const fee = { 'open source': 1.08, 'private': 1.18, 'full': 1.30 }

class TaskPaymentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      price: 0,
      orderPrice: 0,
      samplePrice: 0,
      plan: null,
      tabValue: 'card',
      checkPlan(plan) {
        if(!plan || !this.plan) return false
        return this.plan === plan
      },
      priceAfterFee() {
        return this.plan && Number((parseInt(this.price) * fee[this.plan]).toFixed(2))
      },
    }
  }

  componentDidMount() {
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

  handleChange = (event, newValue) => {
    this.setState({ tabValue: newValue })
  }

  render() {
    const { classes, intl, open, onClose } = this.props
    const { tabValue } = this.state

    return (
      <>
        <Drawer
          open={open} onClose={onClose}
          aria-labelledby='form-dialog-title'
          maxWidth='md'
          anchor='right'
          fullWidth
        >
          <Container>
            <div style={{ padding: 20 }}>
              <Typography variant='h5' id='form-dialog-title' gutterBottom>
                <FormattedMessage id='task.payment.headline' defaultMessage='New payment for an issue' />
              </Typography>
              <div className={classes.details}>
                <Typography variant='subtitle2'>
                  <FormattedMessage id='issue.payment.headline.bounty.add' defaultMessage='Add a bounty for this issue' />
                </Typography>
                <Typography variant='body1' color='textSecondary' gutterBottom>
                  <FormattedMessage id='issue.payment.form.message.subheading' defaultMessage='Create a bounty for this issue and who you assign will receive the payment for this bounty' />
                </Typography>
                <div className={classes.chipContainer}>
                  <Chip
                    label=' $ 20'
                    className={classes.chip}
                    onClick={() => this.pickTaskPrice(20)}
                  />
                  <Chip
                    label=' $ 50'
                    className={classes.chip}
                    onClick={() => this.pickTaskPrice(50)}
                  />
                  <Chip
                    label=' $ 100'
                    className={classes.chip}
                    onClick={() => this.pickTaskPrice(100)}
                  />
                  <Chip
                    label=' $ 150'
                    className={classes.chip}
                    onClick={() => this.pickTaskPrice(150)}
                  />
                  <Chip
                    label=' $ 300'
                    className={classes.chip}
                    onClick={() => this.pickTaskPrice(300)}
                  />
                </div>
                <Grid
                  
                  container
                  spacing={0}
                >
                <Grid
                  spacing={0}
                  xs={0}
                  md={4}
                  lg={4}
                >
                <form className={classes.formPayment} action='POST'>
                  <FormControl>
                    <InputLabel htmlFor='adornment-amount'>
                      <FormattedMessage id='task.payment.input.amount.value' defaultMessage='Price' />
                    </InputLabel>
                    <FormattedMessage id='task.payment.input.amount' defaultMessage='Price insert a value for this task' >
                      {(msg) => (
                        <Input
                          id='adornment-amount'
                          endAdornment={
                            <InputAdornment position='end'> + </InputAdornment>
                          }
                          startAdornment={
                            <InputAdornment position='start'>
                              $
                            </InputAdornment>
                          }
                          placeholder={msg}
                          type='number'
                          inputProps={{ 'min': 0, style: { textAlign: 'right', height: 92  }}}
                          defaultValue={this.state.price}
                          value={this.state.price}
                          onChange={this.handleInputChange}
                          align='right'
                          style={{ fontSize: 42, fontWeight: 'bold' }}
                        />
                      )}
                    </FormattedMessage>
                  </FormControl>
                </form>
                </Grid>
                <Grid
                  xs={0}
                  md={8}
                  lg={8}
                >
                  <TaskPaymentPlans
                    classes={classes}
                    plan={this.props.plan}
                  />  
                </Grid>
                </Grid>
                <div>
                <Tabs
                  value={tabValue}
                  onChange={this.handleChange}
                  indicatorColor='secondary'
                  textColor='secondary'
                >
                  <Tab label={intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodCrediCard)} value='card' />
                  <Tab label={intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodInvoice)} value='invoice' />
                  <Tab label={intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodPaypal)} value='paypal' />
                </Tabs>
                { tabValue === 'card' &&
                    <Button
                      style={{ marginLeft: 20 }}
                      disabled={!this.state.priceAfterFee()}
                      onClick={() => this.handlePayment('PaymentDialog')}
                      variant='contained'
                      color='primary'
                      className={classes.btnPayment}
                    >
                      <FormattedMessage 
                        id='task.payment.creditcard.action'
                        defaultMessage='Pay {amount} with Credit Card'
                        values={{
                          amount: this.formatCurrency(this.state.priceAfterFee())
                        }}
                      />
                    </Button>
                  }
                  { tabValue === 'invoice' &&
                    <Button
                    disabled={!this.state.priceAfterFee()}
                    onClick={() => this.handlePayment('InvoicePayment')}
                    variant='contained'
                    color='primary'
                    className={classes.btnPayment}
                    >
                      <FormattedMessage id='task.payment.invoice.action' defaultMessage='Pay {amount} with Invoice' values={{
                        amount: this.formatCurrency(this.state.priceAfterFee())
                      }} />
                    </Button> 
                  }
                  { tabValue === 'paypal' &&
                    <Button
                      disabled={!this.state.priceAfterFee()}
                      onClick={() => this.handlePayment('PaypalPaymentDialog')}
                      variant='contained'
                      color='primary'
                      className={classes.btnPayment}
                    >
                      <FormattedMessage id='task.payment.paypal.action' defaultMessage='Pay {amount} with PayPal' values={{
                        amount: this.formatCurrency(this.state.priceAfterFee())
                      }} />
                    </Button>
                  }
                </div>
              </div>

            </div>
          </Container>
        </Drawer>
        <PaymentDialog
          open={this.props.dialog.open && this.props.dialog.target === 'PaymentDialog'}
          onClose={this.props.closeDialog}
          addNotification={this.props.addNotification}
          onPayment={this.props.updateTask}
          price={this.state.price}
          formatedPrice={this.formatCurrency(this.state.priceAfterFee())}
          user={this.props.user}
          task={this.props.match.params.id}
          plan={this.state.plan}
        />

        <PaypalPaymentDialog
          open={this.props.dialog.open && this.props.dialog.target === 'PaypalPaymentDialog'}
          onClose={this.props.closeDialog}
          addNotification={this.props.addNotification}
          onPayment={this.props.updateTask}
          price={this.state.price}
          formatedPrice={this.formatCurrency(this.state.priceAfterFee())}
          taskId={this.props.match.params.id}
          createOrder={this.props.createOrder}
          user={this.props.user}
          order={this.props.order}
          plan={this.state.plan}
        />
      </>
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

export default injectIntl(TaskPaymentForm)
