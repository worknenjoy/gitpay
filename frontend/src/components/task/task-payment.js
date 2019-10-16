import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'

import {
  withStyles,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  AppBar,
  Tabs,
  Tab,
  Chip,
} from '@material-ui/core'
import {
  FilterList as FilterListIcon,
  Redeem as RedeemIcon
} from '@material-ui/icons'
import blue from '@material-ui/core/colors/blue'
import PaymentTypeIcon from '../payment/payment-type-icon'

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
}

const messages = defineMessages({
  statusOpen: {
    id: 'task.status.label.open',
    defaultMessage: 'Open'
  },
  statusSucceeded: {
    id: 'task.status.label.succeeded',
    defaultMessage: 'Paid',
  },
  statusFail: {
    id: 'task.status.label.fail',
    defaultMessage: 'Payment canceled'
  },
  statusCanceled: {
    id: 'task.status.label.canceled',
    defaultMessage: 'Payment failed'
  },
  labelCreditCard: {
    id: 'task.status.label.creditcard',
    defaultMessage: 'Credit Card'
  },
  labelPayPal: {
    id: 'task.status.label.paypal',
    defaultMessage: 'Paypal'
  },
  labelNoPayment: {
    id: 'task.status.label.none',
    defaultMessage: 'No payment type'
  },
  statusAnd: {
    id: 'task.status.label.and',
    defaultMessage: 'and'
  },
  allPayments: {
    id: 'task.payment.filter.all',
    defaultMessage: 'All payments'
  },
  creditCardPayment: {
    id: 'task.payment.filter.creditcard',
    defaultMessage: 'Credit Card payments'
  },
  payPalPayment: {
    id: 'task.payment.filter.paypal',
    defaultMessage: 'Paypal payments'
  },
  undefinedLabel: {
    id: 'task.payment.status.undefined',
    defaultMessage: 'Undefined status'
  },
  transferMessage: {
    id: 'task.payment.transfer.message',
    defaultMessage: 'You will send the payment for this task to {to} that receive payments in {payments}'
  },
  taskNoAssigned: {
    id: 'task.payment.noAssigned',
    defaultMessage: 'Noboby assigned to this task, so you need to first assign and then we can conclude the payment'
  }

})

class TaskPayment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTab: 0
    }
  }

  componentDidMount () {

  }

  payTask = e => {
    this.props.onPayTask(this.props.id, this.props.values.card)
    this.props.onClose()
  }

  payOrder = (e, id) => {
    this.props.onPayOrder({ id })
    this.props.onClose()
  }

  onTabChange = (e, value) => {
    const providerTab = ['all', 'stripe', 'paypal']
    e.preventDefault()
    this.setState({ currentTab: value })
    this.props.filterTaskOrders({
      provider: providerTab[value]
    })
  }

  statuses = (status) => {
    const possibles = {
      open: this.props.intl.formatMessage(messages.statusOpen),
      succeeded: this.props.intl.formatMessage(messages.statusSucceeded),
      fail: this.props.intl.formatMessage(messages.statusFail),
      canceled: this.props.intl.formatMessage(messages.statusCanceled)
    }
    return possibles[status]
  }

  render () {
    const { classes, orders, ...other } = this.props

    const TabContainer = props => {
      return (
        <Typography component='div' style={ { padding: 8 * 3 } }>
          { props.children }
        </Typography>
      )
    }

    const hasOrders = () => {
      return this.props.orders && !!this.props.orders.length
    }

    const paymentSupport = user => {
      let supportedTypes = []
      if (user.account_id) {
        supportedTypes.push(this.props.intl.formatMessage(messages.labelCreditCard))
      }
      if (user.paypal_id) {
        supportedTypes.push(this.props.intl.formatMessage(messages.labelPayPal))
      }
      if (!supportedTypes.length) return this.props.intl.formatMessage(messages.labelNoPayment)

      return supportedTypes.join(` ${this.props.intl.formatMessage(messages.statusAnd)} `)
    }

    const sendTo = id => {
      const chosen = this.props.assigns.filter(item => {
        return item.id === id
      })
      return chosen.length && chosen[0].User || {}
    }

    return (
      <Dialog
        onClose={ this.props.onClose }
        aria-labelledby='simple-dialog-title'
        fullWidth
        maxWidth='md'
        { ...other }
      >
        <DialogTitle id='simple-dialog-title'>
          <FormattedMessage id='task.payment.action.title' defaultMessage='Pay for this task' />
        </DialogTitle>
        <DialogContent>
          { this.props.paid && (
            <Typography type='subheading' color='primary' gutterBottom noWrap>
              <FormattedMessage id='task.payment.transfers.concluded' defaultMessage='All transfers was succeeded to the destination account' />
            </Typography>
          ) }
          <div>
            <AppBar position='static' color='default' style={ { marginTop: 20, boxShadow: 'none', background: 'transparent' } }>
              <Tabs
                value={ this.state.currentTab }
                onChange={ this.onTabChange }
                scrollable
                scrollButtons='on'
                indicatorColor='primary'
                textColor='primary'
              >
                <Tab
                  style={ { margin: 10 } }
                  value={ 0 }
                  label={ this.props.intl.formatMessage(messages.allPayments) }
                  icon={ <RedeemIcon /> }
                />
                <Tab
                  style={ { margin: 10 } }
                  value={ 1 }
                  label={ this.props.intl.formatMessage(messages.creditCardPayment) }
                  icon={ <PaymentTypeIcon type='card' notext /> }
                />
                <Tab
                  style={ { margin: 10 } }
                  value={ 2 }
                  label={ this.props.intl.formatMessage(messages.payPalPayment) }
                  icon={ <PaymentTypeIcon type='paypal' /> }
                />
              </Tabs>
            </AppBar>
            <TabContainer>
              { this.props.transferId && (
                <div>
                  <Typography type='subheading' color='primary' gutterBottom noWrap>
                    <FormattedMessage id='task.payment.transfer.done' defaultMessage='All your transfer was concluded with your credit card and the transaction id is: ' />
                  </Typography>
                  <Typography type='subheading' color='primary' gutterBottom noWrap>
                    { `${this.props.transferId}` }
                  </Typography>
                </div>
              ) }
              <List>
                { orders && orders.map((order, index) => (
                  <div>
                    { order.provider === 'paypal'
                      ? (
                        <ListItem key={ order.id }>
                          <ListItemAvatar>
                            <Avatar className={ classes.avatar }>
                              <FilterListIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={ `$ ${order.amount}` }
                            secondary={ `${this.statuses(order.status) || this.props.intl.formatMessage(messages.undefinedLabel)}` }
                          />
                          { !order.transfer_id
                            ? (
                              <Button
                                onClick={ (e) => this.payOrder(e, order.id) }
                                style={ { float: 'right', margin: 10 } }
                                variant='contained'
                                color='primary'
                                disabled={ !this.props.assigned || !sendTo(this.props.assigned).paypal_id }
                              >
                                <RedeemIcon style={ { marginRight: 10 } } />
                                <FormattedMessage id='task.payment.pay.button.credit' defaultMessage='Pay $ {value}' values={ {
                                  value: order.amount
                                } } />
                              </Button>
                            ) : (
                              <FormattedMessage id='task.payment.pay.button.paypal' defaultMessage='Pay with PayPal (id: {transfer}' values={ {
                                transfer: order.transfer_id
                              } } >
                                { (msg) => (
                                  <Chip label={ msg } />
                                ) }
                              </FormattedMessage>
                            )
                          }
                        </ListItem>
                      ) : (
                        <ListItem key={ order.id }>
                          <ListItemAvatar>
                            <Avatar className={ classes.avatar }>
                              <FilterListIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={ `$ ${order.amount}` }
                            secondary={ `${this.statuses(order.status) || this.props.intl.formatMessage(messages.labelCreditCard)}` }
                          />
                        </ListItem>
                      )
                    }
                  </div>
                )) }
              </List>
            </TabContainer>
          </div>
          <DialogContentText>
            <span style={ { display: 'inline-block', margin: 20 } }>
              { !this.props.paid ? (
                <div>
                  { this.props.assigned
                    ? this.props.intl.formatMessage(messages.transferMessage, {
                      to: sendTo(this.props.assigned).username,
                      payments: paymentSupport(sendTo(this.props.assigned))
                    })
                    : this.props.intl.formatMessage(messages.taskNoAssigned)
                  }
                </div>
              ) : (
                <div>
                  <FormattedMessage id='task.payment.done.to' defaultMessage='You made a payment to $ {user}' values={ {
                    user: sendTo(this.props.assigned).username
                  } } />
                </div>
              ) }
            </span>
          </DialogContentText>
          <Divider />
          { hasOrders() ? (
            <div>
              { !this.props.paid && (
                <Button
                  onClick={ this.payTask }
                  style={ { float: 'right', margin: 10 } }
                  variant='contained'
                  color='primary'
                  disabled={ !this.props.assigned || this.props.transferId || this.state.currentTab === 2 }
                >
                  <RedeemIcon style={ { marginRight: 10 } } />
                  <FormattedMessage id='task.payment.start.payTo' defaultMessage='Pay $ {value}' values={ {
                    value: this.props.values.card || 0
                  } } />
                </Button>
              ) }
            </div>
          ) : (
            <FormattedMessage id='task.payment.types.notype' defaultMessage='No payment for this payment type'>
              { (msg) => (
                <ListItemText
                  variant='contained'
                  disabled
                  primary={ msg }
                />
              ) }
            </FormattedMessage>
          ) }
          { !this.props.paid ? (
            <Button
              onClick={ this.props.onClose }
              style={ { float: 'right', margin: 10 } }
            >
              <FormattedMessage id='task.payment.action.cancel' defaultMessage='Cancel' />
            </Button>
          ) : (
            <Button
              onClick={ this.props.onClose }
              style={ { float: 'right', margin: 10 } }
            >
              <FormattedMessage id='task.payment.action.close' defaultMessage='Close' />
            </Button>
          ) }
        </DialogContent>
      </Dialog>
    )
  }
}

TaskPayment.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onPay: PropTypes.func,
  onPayOrder: PropTypes.func,
  onPayTask: PropTypes.func,
  selectedValue: PropTypes.string,
  id: PropTypes.number,
  orders: PropTypes.array,
  assigned: PropTypes.number,
  paid: PropTypes.bool,
  assigns: PropTypes.array,
  transferId: PropTypes.string,
  filterTaskOrders: PropTypes.func,
  values: PropTypes.object
}

export default injectIntl(withStyles(styles)(TaskPayment))
