import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import 'react-placeholder/lib/reactPlaceholder.css'
import { messages } from '../task/messages/task-messages'
import MomentComponent from 'moment'
import PaymentTypeIcon from '../payment/payment-type-icon'

import {
  Container,
  Tabs,
  Tab,
  withStyles,
  Button,
  Link,
  Typography
} from '@material-ui/core'

import {
  Redeem as RedeemIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  SwapHoriz as TransferIcon,
  Receipt as ReceiptIcon
} from '@material-ui/icons'
import slugify from '@sindresorhus/slugify'

import TaskPaymentCancel from '../task/task-payment-cancel'
import TaskOrderDetails from '../task/order/task-order-details'
import TaskOrderTransfer from '../task/order/task-order-transfer'
import PaymentRefund from './payment-refund'
import CustomPaginationActionsTable from './payments-table'

const styles = theme => ({
  paper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  button: {
    width: 100,
    font: 10
  }
})

class Payments extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cancelPaypalConfirmDialog: false,
      orderDetailsDialog: false,
      transferDialogOpen: false,
      refundDialogOpen: false,
      currentOrderId: null
    }
  }

  async componentDidMount () {
    await this.props.listOrders({ userId: this.props.user.id })
  }

  handlePayPalDialogOpen = (e, id) => {
    e.preventDefault()
    this.setState({ cancelPaypalConfirmDialog: true, currentOrderId: id })
  }

  handlePayPalDialogClose = () => {
    this.setState({ cancelPaypalConfirmDialog: false })
  }

  handleCancelPaypalPayment = async () => {
    const orderId = this.state.currentOrderId
    this.setState({ cancelPaypalConfirmDialog: false, orderDetailsDialog: false })
    await this.props.cancelPaypalPayment(orderId)
  }

  openOrderDetailsDialog = async (e, id) => {
    await this.props.getOrderDetails(id)
    this.setState({ orderDetailsDialog: true, currentOrderId: id })
  }

  openTransferDialog = async (e, item) => {
    await this.props.listTasks({})
    await this.props.filterTasks('userId')
    this.setState({ transferDialogOpen: true })
  }

  openRefundDialog = async (e, item) => {
    this.setState({ refundDialogOpen: true, currentOrderId: item.id })
  }

  closeRefundDialog = async () => {
    this.setState({ refundDialogOpen: false })
  }

  closeTransferDialog = (e, item) => {
    // await this.props.getOrderDetails(item.id)
    this.setState({ transferDialogOpen: false })
  }

  closeOrderDetailsDialog = () => {
    this.setState({ orderDetailsDialog: false })
  }

  render () {
    const { classes, orders, user, logged } = this.props

    const statuses = {
      open: this.props.intl.formatMessage(messages.openPaymentStatus),
      succeeded: this.props.intl.formatMessage(messages.succeededStatus),
      fail: this.props.intl.formatMessage(messages.failStatus),
      canceled: this.props.intl.formatMessage(messages.canceledStatus),
      refunded: this.props.intl.formatMessage(messages.refundedStatus)
    }

    const retryPaypalPayment = (e, paymentUrl) => {
      e.preventDefault()

      if (paymentUrl) {
        window.location.href = paymentUrl
        window.location.reload()
      }
    }

    const cancelPaypalPayment = (e, id) => {
      e.preventDefault()

      if (id) {
        this.handlePayPalDialogOpen(e, id)
      }
    }

    const retryPaypalPaymentButton = (paymentUrl) => {
      return (
        <Button style={ { marginTop: 10, paddingTop: 2, paddingBottom: 2, width: 'auto' } } variant='contained' size='small' color='primary' className={ classes.button } onClick={ (e) => {
          retryPaypalPayment(e, paymentUrl)
        } }>
          <FormattedMessage id='general.buttons.retry' defaultMessage='Retry' />
          <RefreshIcon style={ { marginLeft: 5, marginRight: 5 } } />
        </Button>
      )
    }

    const cancelPaypalPaymentButton = (id) => {
      return (
        <Button style={ { paddingTop: 2, paddingBottom: 2, marginTop: 10, width: 'auto' } } variant='contained' size='small' color='primary' className={ classes.button } onClick={ (e) => {
          cancelPaypalPayment(e, id)
        } }>
          <FormattedMessage id='general.buttons.cancel' defaultMessage='Cancel' />
          <CancelIcon style={ { marginLeft: 5, marginRight: 5 } } />
        </Button>
      )
    }

    const detailsOrderButton = (item, userId) => {
      if (item.provider === 'paypal') {
        if (item.User && userId === item.User.id) {
          return (
            <Button
              style={ { paddingTop: 2, paddingBottom: 2, width: 'auto', marginRight: 5 } }
              variant='contained'
              size='small'
              color='primary'
              className={ classes.button }
              onClick={ (e) => this.openOrderDetailsDialog(e, item.id) }
            >
              <FormattedMessage id='general.buttons.details' defaultMessage='Details' />
              <InfoIcon style={ { marginLeft: 5, marginRight: 5 } } />
            </Button>
          )
        }
      }
    }

    const issueRow = issue => {
      return (<span>
        { issue && issue.title
          ? (
            <Link href='' onClick={ (e) => {
              e.preventDefault()
              window.location.href = `/#/task/${issue.id}/${slugify(issue.title)}`
              window.location.reload()
            } }>{ issue.title }</Link>
          ) : (
            'no issue found'
          )
        }
      </span>)
    }

    const retryOrCancelButton = (item, userId) => {
      if (item.User && item.provider === 'paypal' && userId === item.User.id) {
        if ((item.status === 'fail' || item.status === 'open') && item.payment_url) {
          return retryPaypalPaymentButton(item.payment_url)
        }
        else if (item.status === 'succeeded') {
          return cancelPaypalPaymentButton(item.id)
        }
        else {
          return ''
        }
      }
    }

    const transferButton = (item, userId) => {
      if (item.User && item.provider === 'stripe' && userId === item.User.id) {
        if (item.status === 'succeeded' && item.Task && item.Task.status === 'open' && item.Task.paid === false && !item.Task.transfer_id) {
          return (
            <React.Fragment>
              <Button
                style={ { paddingTop: 2, paddingBottom: 2, width: 'auto', marginLeft: 5, marginRight: 5 } }
                variant='contained'
                size='small'
                color='primary'
                className={ classes.button }
                onClick={ (e) => this.openTransferDialog(e, item) }
              >
                <FormattedMessage id='general.buttons.transfer' defaultMessage='Transfer' />
                <TransferIcon style={ { marginLeft: 5, marginRight: 5 } } />
              </Button>
              <TaskOrderTransfer task={ item.Task } order={ item } onSend={ this.props.transferOrder } tasks={ this.props.tasks } open={ this.state.transferDialogOpen } onClose={ this.closeTransferDialog } />
            </React.Fragment>
          )
        }
        else {
          return ''
        }
      }
    }

    const refundButton = (item, userId) => {
      if (item.User && userId === item.User.id) {
        if (item.status === 'succeeded' && item.provider === 'stripe' && item.Task && item.Task.status === 'open' && item.Task.paid === false && !item.Task.transfer_id) {
          return (
            <React.Fragment>
              <Button
                style={ { paddingTop: 2, paddingBottom: 2, width: 'auto', marginTop: 10, marginRight: 5 } }
                variant='contained'
                size='small'
                color='primary'
                className={ classes.button }
                onClick={ (e) => this.openRefundDialog(e, item) }
              >
                <FormattedMessage id='general.buttons.refund' defaultMessage='Refund' />
                <ReceiptIcon style={ { marginLeft: 5, marginRight: 5 } } />
              </Button>
            </React.Fragment>
          )
        }
        else {
          return ''
        }
      }
    }

    const displayOrders = orders => {
      if (!orders) return []

      if (!orders.length) {
        return []
      }

      let userId

      if (logged) {
        userId = user.id
      }

      return orders.map((item, i) => [
        item.paid ? this.props.intl.formatMessage(messages.labelYes) : this.props.intl.formatMessage(messages.labelNo),
        <div style={ { display: 'inline-block' } }>
          <span style={ { display: 'inline-block', width: '100%', marginRight: '1rem', marginBottom: '1em' } }>{ statuses[item.status] }</span>
        </div>,
        issueRow(item.Task),
        `$ ${item.amount}`,
        <PaymentTypeIcon type={ item.provider } />,
        <Typography variant='caption'>{ MomentComponent(item.createdAt).fromNow() }</Typography>,
        <div style={ { display: 'inline-block' } }>
          { detailsOrderButton(item, userId) }
          { retryOrCancelButton(item, userId) }
          { transferButton(item, userId) }
          { refundButton(item, userId) }
        </div>,

      ])
    }

    return (
      <div style={ { marginTop: 40 } }>
        <Container>
          <Typography variant='h5' gutterBottom>
            <FormattedMessage id='general.payments' defaultMessage='Payments' />
          </Typography>
          <div style={ { marginTop: 40, marginBottom: 30 } }>
            <CustomPaginationActionsTable 
              tableHead={ [
                this.props.intl.formatMessage(messages.cardTableHeaderPaid),
                this.props.intl.formatMessage(messages.cardTableHeaderStatus),
                this.props.intl.formatMessage(messages.cardTableHeaderIssue),
                this.props.intl.formatMessage(messages.cardTableHeaderValue),
                this.props.intl.formatMessage(messages.cardTableHeaderPayment),
                this.props.intl.formatMessage(messages.cardTableHeaderCreated),
                this.props.intl.formatMessage(messages.cardTableHeaderActions)
              ] }
              payments={
                orders && orders.data && orders.data.length ? 
                  {...orders, data: displayOrders(orders.data)} : []
              }
            />
          </div>
        </Container>
        <TaskPaymentCancel
          cancelPaypalConfirmDialog={ this.state.cancelPaypalConfirmDialog }
          handlePayPalDialogClose={ this.handlePayPalDialogClose }
          handleCancelPaypalPayment={ this.handleCancelPaypalPayment }
          listOrders={ async () => this.props.listOrders({ userId: this.props.user.id }) }
        />
        <TaskOrderDetails
          open={ this.state.orderDetailsDialog }
          order={ this.props.order }
          onClose={ this.closeOrderDetailsDialog }
          onCancel={ this.handlePayPalDialogOpen }
        />
        <PaymentRefund
          open={ this.state.refundDialogOpen }
          handleClose={ () => this.closeRefundDialog() }
          orderId={ this.state.currentOrderId }
          onRefund={ this.props.refundOrder }
          listOrders={ async () => this.props.listOrders({ userId: this.props.user.id }) }
        />
      </div>
    )
  }
}

Payments.propTypes = {
  classes: PropTypes.object.isRequired,
  handleTabChange: PropTypes.func,
  user: PropTypes.object,
  logged: PropTypes.bool
}

export default injectIntl(withStyles(styles)(Payments))
