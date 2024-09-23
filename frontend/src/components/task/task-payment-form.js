import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
 
import PaymentDrawer from '../design-library/templates/payment-drawer/payment-drawer'

import PaymentDialog from '../payment/payment-dialog'
import PaypalPaymentDialog from '../payment/paypal-payment-dialog'
import PaymentMethodInvoiceTab from './payment/methods/invoice/payment-method-invoice-tab'


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
        if (!plan || !this.plan) return false
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
    const { classes, intl, open, onClose, fetchCustomer, customer } = this.props

    const tags = [
      {
        id: 1,
        name: '$ 20',
        value: 20
      },
      {
        id: 2,
        name: '$ 50',
        value: 50
      },
      {
        id: 3,
        name: '$ 100',
        value: 100
      },
      {
        id: 4,
        name: '$ 150',
        value: 150
      },
      {
        id: 5,
        name: '$ 300',
        value: 300
      }
    ]

    return (
      <PaymentDrawer
        title={ <FormattedMessage id='task.payment.headline' defaultMessage='New payment for an issue' />}
        pickupTagListMessagesPrimaryText={<FormattedMessage id='issue.payment.headline.bounty.add' defaultMessage='Add a bounty for this issue' />}
        pickupTagListMessagesSecondaryText={<FormattedMessage id='issue.payment.form.message.subheading' defaultMessage='Create a bounty for this issue and who you assign will receive the payment for this bounty' />}
        onChangePrice={(price) => this.pickTaskPrice(price)}
        open={open}
        onClose={onClose}
        plan={{
          fee: 8,
          category: <FormattedMessage id='actions.task.payment.plan.opensource' defaultMessage='Open Source' />,
          title: <FormattedMessage id='actions.task.payment.plan.opensource.info' defaultMessage='For Open Source Project' />,
          items: [
            <FormattedMessage id='actions.task.payment.plan.bullet.public' defaultMessage='For Public Projects' />,
            <FormattedMessage id='actions.task.payment.plan.bullet.basic' defaultMessage='Basic Campaign' />,
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
                formatCurrency={this.formatCurrency}
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

export default injectIntl(TaskPaymentForm)
