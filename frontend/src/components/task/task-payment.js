import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MomentComponent from 'moment'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import Alert from '@material-ui/lab/Alert'
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
  PaymentOutlined as FilterListIcon,
  Redeem as RedeemIcon
} from '@material-ui/icons'
import blue from '@material-ui/core/colors/blue'
import PaymentTypeIcon from '../payment/payment-type-icon'
import InterestedUsers from './components/interested-users'
import InterestedOffers from './components/interested-offers'
import MessageAssignment from './assignment/messageAssignment'
import TaskAssigned from './task-assigned'

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
  statusRefunded: {
    id: 'task.status.label.refunded',
    defaultMessage: 'Refunded'
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

const StyledTab = withStyles({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'inherit',
  },
  svgIcon: { 
    root: {
      width: 16,
      height: 16,
    },
  }  
})(Tab);

class TaskPayment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTab: 0,
      messageDialog: false,
      interested: null,
      messageType: 'assign'
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
      canceled: this.props.intl.formatMessage(messages.statusCanceled),
      refunded: this.props.intl.formatMessage(messages.statusRefunded)
    }
    return possibles[status]
  }

  render () {
    const { classes, orders, offers, ...other } = this.props

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
      const chosen = this.props.assigns && this.props.assigns.filter(item => {
        return item.id === id
      })
      return chosen && chosen.length && chosen[0].User || {}
    }

    const openMessageDialog = (id, messageType = 'assign') => {
      this.setState({ messageDialog: true, interested: id, messageType })
    }

    const closeMessageDialog = () => {
      this.setState({ messageDialog: false })
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
            <AppBar position='static' color='default' style={ { boxShadow: 'none', background: 'transparent' } }>
              <Tabs
                value={ this.state.currentTab }
                onChange={ this.onTabChange }
                scrollable
                scrollButtons='on'
                indicatorColor='secondary'
                textColor='secondary'
              >
                <StyledTab
                  value={ 0 }
                  label={this.props.intl.formatMessage(messages.allPayments)}
                  icon={<RedeemIcon style={{marginRight: 10}} />}
                />
                <StyledTab
                  
                  value={ 1 }
                  label={ this.props.intl.formatMessage(messages.creditCardPayment) }
                  icon={ <PaymentTypeIcon type='card' notext style={{marginRight: 10}} /> }
                />
                <StyledTab
                  
                  value={ 2 }
                  label={ this.props.intl.formatMessage(messages.payPalPayment) }
                  icon={ <PaymentTypeIcon type='paypal' style={{marginRight: 10}} /> }
                />
              </Tabs>
            </AppBar>
            <TabContainer>
              { this.props.transferId ? (
                <div>
                  <Typography type='subheading' color='primary' gutterBottom noWrap>
                    <FormattedMessage id='task.payment.transfer.done' defaultMessage='All your transfer was concluded with your credit card and the transaction id is: ' />
                  </Typography>
                  <Typography type='subheading' color='primary' gutterBottom noWrap>
                    { `${this.props.transferId}` }
                  </Typography>
                </div>
              )
                : <List>
                  { orders.length > 0 ? orders.map((order, index) => (
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
                              primary={ `$ ${order.amount} by ${order?.User?.name || 'unknown'}` }
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
                                <FormattedMessage id='task.payment.pay.button.paypal' defaultMessage='Paid with PayPal (id: {transfer}' values={ {
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
                              primary={ 
                              <div style={{display: 'flex', verticalAlign: 'center'}}>
                                <Typography variant='subtitle1' gutterBottom style={{marginRight: 10}}>
                                  {`$ ${order.amount}`}
                                </Typography>
                                <Typography variant='caption' style={{marginTop: 3}}>
                                  {order?.User ? 'by ' + order?.User?.name : ''} 
                                </Typography>
                              </div>}
                              secondary={ `${this.statuses(order.status) + ' ' + MomentComponent(order.createdAt).fromNow() || this.props.intl.formatMessage(messages.labelCreditCard)}` }
                            />
                            <Button
                              onClick={ this.payTask }
                              style={ { float: 'right', margin: 10 } }
                              variant='contained'
                              color='primary'
                              disabled={ !this.props.assigned }
                            >
                              <RedeemIcon style={ { marginRight: 10 } } />
                              <FormattedMessage id='task.payment.pay.button.credit' defaultMessage='Pay $ {value}' values={ {
                                value: order.amount
                              } } />
                            </Button>
                          </ListItem>
                        )
                      }
                    </div>
                  )) : (
                    <div>
                      <Alert severity='info'>
                        <FormattedMessage id='task.payment.noTransfers' defaultMessage='No bounties for this issue' />
                      </Alert>
                    </div>
                  ) }
                </List> }
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
                    : <Alert severity='warning'>
                        {this.props.intl.formatMessage(messages.taskNoAssigned)}
                      </Alert>
                  }
                  { this.props.assigned ? 
                      <TaskAssigned
                        task={ { id: this.props.id, assigned: this.props.assigned } }
                        assign={ {id: this.props.assigned } }
                        isOwner={ this.props.isOwner }
                        user={ sendTo(this.props.assigned) }
                        loggedUser={ this.props.loggedUser }
                        removeAssignment={ this.props.removeAssignment }
                        assignTask={ this.props.assignTask }
                      /> : null
                  }
                  { this.props?.assigns?.length > 0 ? 
                    <div style={{marginTop: 20}}>
                      <Typography variant='h5' gutterBottom noWrap>
                        <FormattedMessage id='task.payment.interested' defaultMessage='Interested users' />
                      </Typography>
                      <InterestedUsers 
                        assigned={this.props.assigned}
                        users={this.props.assigns}
                        onMessage={openMessageDialog}
                        onAccept={async (id) => await this.props.assignTask(this.props.id, id)}
                        onReject={async (id) => await this.props.actionAssign(this.props.id, id, false)}
                      />
                    </div> : null
                  }
                  { offers?.length ? 
                    <div style={{marginTop: 20}}>
                      <Typography variant='h5' gutterBottom noWrap>
                        <FormattedMessage id='task.payment.offers' defaultMessage='Offers' />
                      </Typography>
                      <InterestedOffers offers={offers} assigned={this.props.assigned} onMessage={(id) => openMessageDialog(id, 'offers') } />
                    </div> : null
                  }
                  <MessageAssignment
                    visible={ this.state.messageDialog }
                    onClose={ closeMessageDialog }
                    id={ this.props.id }
                    to={ this.state.interested }
                    messageAction={ this.state.messageType === 'assign' ? this.props.messageTask : this.props.messageOffer }
                  />
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
          ) : null }
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
