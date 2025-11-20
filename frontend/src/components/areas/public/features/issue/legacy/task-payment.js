import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MomentComponent from 'moment'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import {
  Container,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Drawer,
  AppBar,
  Tabs,
  Tab,
  Chip
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { PaymentOutlined as FilterListIcon, Redeem as RedeemIcon } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import blue from '@mui/material/colors/blue'
import PaymentTypeIcon from '../../../../private/features/payments/legacy/payment-type-icon'
import InterestedUsers from './components/interested-users'
import InterestedOffers from './components/interested-offers'
import MessageAssignment from './assignment/messageAssignment'
import TaskAssigned from './task-assigned'
import TaskOrderInvoiceConfirm from './task-order-invoice-confirm'
import { formatCurrency } from '../../../../../../utils/format-currency'

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
    defaultMessage: 'Paid'
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
    id: 'task.payment.transfer.notRegistered',
    defaultMessage:
      'The user {to} who will receive the payment, it has no {payments} registered. We will help him to register and send the payment to his registered account'
  },
  taskNoAssigned: {
    id: 'task.payment.noAssigned',
    defaultMessage:
      'Noboby assigned to this task, so you need to first assign and then we can conclude the payment'
  }
})

const StyledTab = styled(Tab)(({ theme }) => ({
  '& .MuiTab-wrapper': {
    flexDirection: 'row',
    alignItems: 'inherit'
  },
  '& svg': {
    width: 16,
    height: 16
  }
}))

class TaskPayment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTab: 0,
      messageDialog: false,
      confirmOrderDialog: false,
      currentOffer: null,
      interested: null,
      messageType: 'assign'
    }
  }

  componentDidMount() {}

  payTask = (e) => {
    const { task } = this.props
    //this.props.onPayTask(this.props.id, this.props.values.card)
    this.props.onTransferTask(task.data.id)
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

  render() {
    const { classes, task, orders, offers, ...other } = this.props

    const TabContainer = (props) => {
      return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
          {props.children}
        </Typography>
      )
    }

    const hasOrders = () => {
      return this.props.orders && !!this.props.orders.length
    }

    const confirmAssignTaskAndCreateOrder = async (event, offer) => {
      this.setState({ confirmOrderDialog: true, currentOffer: offer })
    }

    const assignTaskAndCreateOrder = async (event, offer) => {
      const { task, loggedUser, createOrder, assignTask, assigns } = this.props
      event.preventDefault()

      const assign = this.props.assigns.filter((item) => item.userId === offer.userId)[0]

      ;(await task.data.id) &&
        loggedUser.logged &&
        (await createOrder({
          provider: 'stripe',
          amount: offer.value,
          userId: loggedUser?.user?.id,
          email: loggedUser?.user?.email,
          taskId: task.id,
          currency: 'usd',
          status: 'open',
          source_type: 'invoice-item',
          customer_id: loggedUser?.user?.customer_id,
          metadata: {
            offer_id: offer.id
          }
        }))
      await assignTask(task.data.id, assign.id)
      await this.props.offerUpdate(task.data.id, offer.id, { status: 'accepted' })
      this.setState({ confirmOrderDialog: false, currentOffer: null })
    }

    const onReject = async (event, offer) => {
      event.preventDefault()
      this.props.offerUpdate(task.data.id, offer.id, { status: 'rejected' })
    }

    const sendTo = (id) => {
      const chosen =
        this.props.assigns &&
        this.props.assigns.filter((item) => {
          return item.id === id
        })
      return (chosen && chosen.length && chosen[0].User) || {}
    }

    const openMessageDialog = (id, messageType = 'assign') => {
      this.setState({ messageDialog: true, interested: id, messageType })
    }

    const closeMessageDialog = () => {
      this.setState({ messageDialog: false })
    }

    return (
      <Drawer
        onClose={this.props.onClose}
        aria-labelledby="simple-dialog-title"
        fullWidth
        maxWidth="md"
        anchor="right"
        {...other}
      >
        <Container style={{ padding: 20 }}>
          <Typography variant="h5" id="simple-dialog-title" gutterBottom>
            <FormattedMessage
              id="task.payment.action.title"
              defaultMessage="Send payment for this issue to an user"
            />
          </Typography>
          {this.props.paid && (
            <Typography type="subheading" color="primary" gutterBottom noWrap>
              <FormattedMessage
                id="task.payment.transfers.concluded"
                defaultMessage="All transfers was succeeded to the destination account"
              />
            </Typography>
          )}
          <div>
            <AppBar
              position="static"
              color="default"
              style={{ boxShadow: 'none', background: 'transparent' }}
            >
              <Tabs
                value={this.state.currentTab}
                onChange={this.onTabChange}
                scrollable
                scrollButtons="on"
                indicatorColor="secondary"
                textColor="secondary"
              >
                <StyledTab
                  value={0}
                  label={this.props.intl.formatMessage(messages.allPayments)}
                  icon={<RedeemIcon style={{ marginRight: 10 }} />}
                />
                <StyledTab
                  value={1}
                  label={this.props.intl.formatMessage(messages.creditCardPayment)}
                  icon={<PaymentTypeIcon type="card" notext style={{ marginRight: 10 }} />}
                />
                <StyledTab
                  value={2}
                  label={this.props.intl.formatMessage(messages.payPalPayment)}
                  icon={<PaymentTypeIcon type="paypal" style={{ marginRight: 10 }} />}
                />
              </Tabs>
            </AppBar>
            <TabContainer style={{ paddingBottom: 0 }}>
              {this.props.transferId || this.props.task?.Transfer ? (
                <Alert
                  gutterBottom
                  severity="success"
                  action={
                    <Link to={`/profile/claims`}>
                      <Button size="small" variant="outlined" color="primary">
                        <FormattedMessage
                          id="task.payment.claims.view"
                          defaultMessage="view claims"
                        />
                      </Button>
                    </Link>
                  }
                >
                  <AlertTitle gutterBottom>
                    <Typography type="subheading" color="primary" gutterBottom noWrap>
                      <FormattedMessage
                        id="task.payment.claim.done"
                        defaultMessage="Your claim is concluded"
                      />
                    </Typography>
                  </AlertTitle>

                  {this.props.transferId ? (
                    <Typography type="subheading" color="primary" gutterBottom noWrap>
                      {`${this.props.transferId}`}
                    </Typography>
                  ) : (
                    <div>
                      <Typography type="heading" color="primary" gutterBottom noWrap>
                        <FormattedMessage
                          id="task.payment.claim.value"
                          defaultMessage="Claim of {value} requested"
                          values={{
                            value: formatCurrency(this.props.task?.Transfer?.value)
                          }}
                        />
                      </Typography>
                    </div>
                  )}
                </Alert>
              ) : (
                <List>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <div>
                        {order.provider === 'paypal' ? (
                          <ListItem key={order.id}>
                            <ListItemAvatar>
                              <Avatar className={classes.avatar}>
                                <FilterListIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`$ ${order.amount} by ${order?.User?.name || 'unknown'}`}
                              secondary={`${this.statuses(order.status) || this.props.intl.formatMessage(messages.undefinedLabel)}`}
                            />
                            {!order.transfer_id ? (
                              <Chip label={order.status} />
                            ) : (
                              <FormattedMessage
                                id="task.payment.pay.button.paypal"
                                defaultMessage="Paid with PayPal (id: {transfer}"
                                values={{
                                  transfer: order.transfer_id
                                }}
                              >
                                {(msg) => <Chip label={msg} />}
                              </FormattedMessage>
                            )}
                          </ListItem>
                        ) : (
                          <ListItem key={order.id}>
                            <ListItemAvatar>
                              <Avatar className={classes.avatar}>
                                <FilterListIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <div style={{ display: 'flex', verticalAlign: 'center' }}>
                                  <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    style={{ marginRight: 10 }}
                                  >
                                    {`$ ${order.amount}`}
                                  </Typography>
                                  <Typography variant="caption" style={{ marginTop: 3 }}>
                                    {order?.User ? 'by ' + order?.User?.name : ''}
                                  </Typography>
                                </div>
                              }
                              secondary={`${this.statuses(order.status) + ' ' + MomentComponent(order.createdAt).fromNow() || this.props.intl.formatMessage(messages.labelCreditCard)}`}
                            />
                            <Chip label={order.status} />
                          </ListItem>
                        )}
                      </div>
                    ))
                  ) : (
                    <div>
                      <Alert severity="info" gutterBottom>
                        <FormattedMessage
                          id="task.payment.noTransfers"
                          defaultMessage="No bounties for this issue"
                        />
                      </Alert>
                    </div>
                  )}
                </List>
              )}
            </TabContainer>
          </div>

          <div>
            {!this.props.task?.data?.paid || this.props.task?.Transfer?.id ? (
              <div>
                {this.props.assigned ? (
                  <TaskAssigned
                    task={task.data}
                    assign={{ id: this.props.assigned }}
                    isOwner={this.props.isOwner}
                    user={sendTo(this.props.assigned)}
                    loggedUser={this.props.loggedUser}
                    removeAssignment={this.props.removeAssignment}
                    assignTask={this.props.assignTask}
                    messageTask={this.props.messageTask}
                  />
                ) : null}
                {this.props?.assigns?.length > 0 ? (
                  <div style={{ marginTop: 20 }}>
                    <Typography variant="h5" gutterBottom noWrap>
                      <FormattedMessage
                        id="task.payment.interested"
                        defaultMessage="Interested users"
                      />
                    </Typography>
                    <InterestedUsers
                      assigned={this.props.assigned}
                      users={this.props.assigns}
                      onMessage={openMessageDialog}
                      onAccept={async (id) => await this.props.assignTask(this.props.id, id)}
                      onReject={async (id) =>
                        await this.props.actionAssign(this.props.id, id, false)
                      }
                    />
                  </div>
                ) : null}
                <MessageAssignment
                  visible={this.state.messageDialog}
                  onClose={closeMessageDialog}
                  id={this.props.id}
                  to={this.state.interested}
                  messageAction={
                    this.state.messageType === 'assign'
                      ? this.props.messageTask
                      : this.props.messageOffer
                  }
                />
              </div>
            ) : (
              <div>
                <FormattedMessage
                  id="task.payment.done.to"
                  defaultMessage="You made a payment to $ {user}"
                  values={{
                    user: sendTo(this.props.assigned).username
                  }}
                />
              </div>
            )}
          </div>

          <Divider />
          {hasOrders() ? (
            <div>
              {!this.props.task.data.paid && (
                <Button
                  onClick={this.payTask}
                  style={{ float: 'right', margin: 10 }}
                  variant="contained"
                  color="primary"
                  disabled={
                    !this.props.assigned || this.props.transferId || this.props.task?.Transfer
                  }
                >
                  <RedeemIcon style={{ marginRight: 10 }} />
                  <FormattedMessage
                    id="task.payment.start.payTo"
                    defaultMessage="Pay $ {value}"
                    values={{
                      value:
                        this.props.task.data.values.card + this.props.task.data.values.paypal || 0
                    }}
                  />
                </Button>
              )}
            </div>
          ) : null}
          {!this.props.paid ? (
            <Button onClick={this.props.onClose} style={{ float: 'right', margin: 10 }}>
              <FormattedMessage id="task.payment.action.cancel" defaultMessage="Cancel" />
            </Button>
          ) : (
            <Button onClick={this.props.onClose} style={{ float: 'right', margin: 10 }}>
              <FormattedMessage id="task.payment.action.close" defaultMessage="Close" />
            </Button>
          )}
        </Container>
      </Drawer>
    )
  }
}

TaskPayment.propTypes = {
  onPay: PropTypes.func,
  onPayOrder: PropTypes.func,
  onPayTask: PropTypes.func,
  onTransfer: PropTypes.func,
  orders: PropTypes.array,
  assigns: PropTypes.array,
  filterTaskOrders: PropTypes.func
}

export default injectIntl(TaskPayment)
