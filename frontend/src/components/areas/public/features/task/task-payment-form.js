import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
 
import PaymentDrawer from '../../../../design-library/molecules/drawers/payment-drawer/payment-drawer'

import PaymentDialog from '../../../private/features/payments/payment-dialog'
import PaypalPaymentDialog from '../../../private/features/payments/paypal-payment-dialog'
import PaymentMethodInvoiceTab from './payment/methods/invoice/payment-method-invoice-tab'
import PaymentMethodWalletTab from './payment/methods/wallet/payment-method-wallet-tab'


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
  tabPaymentMethodWallet: {
    id: 'task.payment.method.wallet',
    defaultMessage: 'Wallet'
  }
})

const fee = { 'open source': 1.08, 'private': 1.18, 'full': 1.30 }

class TaskPaymentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      price: 0,
      orderPrice: 0,
      samplePrice: 0,
      plan: 'open source',
      tabValue: 'card',
      checkPlan(plan) {
        if (!plan || !this.plan) return false
        return this.plan === plan
      },
      fee() {
        if(this.plan === 'open source' && this.price >= 5000) return 0 // no fee above $5000
        return this.plan === 'open source' ? 8 : 'cannot calculate fee'
      },
      priceAfterFee() {
        if(!this.price) return 0
        if(this.plan === 'open source' && this.fee() === 0) return this.price // no fee above $5000
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
    const { classes, intl, open, onClose, fetchCustomer, customer } = this.props

    return (
      <PaymentDrawer
        title={ <FormattedMessage id='task.payment.headline' defaultMessage='New payment for an issue' />}
        pickupTagListMessagesPrimaryText={<FormattedMessage id='issue.payment.headline.bounty.add' defaultMessage='Add a bounty for this issue' />}
        pickupTagListMessagesSecondaryText={<FormattedMessage id='issue.payment.form.message.subheading' defaultMessage='Create a bounty for this issue and who you assign will receive the payment for this bounty' />}
        onChangePrice={(price) => this.pickTaskPrice(price)}
        open={open}
        onClose={onClose}
        plan={{
          fee: this.state.fee(),
          category: <FormattedMessage id='actions.task.payment.plan.opensource' defaultMessage='Open Source' />,
          title: <FormattedMessage id='actions.task.payment.plan.opensource.info' defaultMessage='For Open Source Project' />,
          items: [
            this.state.fee() === 0 ? <FormattedMessage id='actions.task.payment.plan.bullet.noFee' defaultMessage='No fee for issues equal or above 5000' /> : undefined,
            <FormattedMessage id='actions.task.payment.plan.bullet.public' defaultMessage='For Public Projects' />,
            <FormattedMessage id='actions.task.payment.plan.bullet.basic' defaultMessage='Basic Campaign' />
          ],
        }}
        tabs={[
          {
            default: true,
            label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodCrediCard),
            value: 'card',
            component: (
              <PaymentDialog
                addNotification={this.props.addNotification}
                onPayment={this.props.updateTask}
                price={this.state.price}
                formatedPrice={this.formatCurrency(this.state.priceAfterFee())}
                user={this.props.user}
                task={this.props.match.params.id}
                plan={this.state.plan}
                onClose={onClose}
              />
            )
          },
          {
            label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodInvoice),
            value: 'invoice',
            component: (
              <PaymentMethodInvoiceTab
                classes={classes}
                priceAfterFee={this.state.priceAfterFee()}
                fetchCustomer={fetchCustomer}
                customer={customer}
                user={this.props.user}
                createOrder={this.props.createOrder}
                task={this.props.task?.data}
                price={this.state.price}
                onPayment={onClose}
              />
            )
          },
          {
            label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodPaypal),
            value: 'paypal',
            component: (
              <PaypalPaymentDialog
                onClose={onClose}
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
            )
          },
          {
            label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodWallet),
            value: 'wallet',
            component: (
              <PaymentMethodWalletTab
                classes={classes}
                user={this.props.user}
                task={this.props.task?.data}
                price={this.state.price}
                priceAfterFee={this.state.priceAfterFee()}
                plan={this.state.plan}
                createOrder={this.props.createOrder}
                fetchWallet={this.props.fetchWallet}
                wallet={this.props.wallet}
                listWallets={this.props.listWallets}
                wallets={this.props.wallets}
                onClose={onClose}
                fetchTask={this.props.fetchTask}
                syncTask={this.props.syncTask}
              />
            )
          }
        ]}
      />
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

export default withRouter(injectIntl(TaskPaymentForm))
