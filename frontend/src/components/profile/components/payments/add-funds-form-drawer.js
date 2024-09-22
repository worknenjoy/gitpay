import React, { useState, useEffect } from 'react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

import {
  Typography,
} from '@material-ui/core'

import PaymentDrawer from '../../../design-library/templates/payment-drawer/payment-drawer'

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

const AddFundsFormDrawer = ({ classes, intl, open, onClose }) => {
  const [price, setPrice] = useState(0)
  const [plan, setPlan] = useState(null)
  const [tabValue, setTabValue] = useState('invoice')

  useEffect(() => {
    
  }, [])

  const formatCurrency = (amount) => {
    return (new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumSignificantDigits: 4
    }).format(amount))
  }

  const pickTaskPrice = (price) => {
    setPrice(price)
  }

  const handleInputChange = (e) => {
    setPrice(e.target.value)
  }

  const handlePayment = (value) => {
    props.openDialog(value)
  }

  const handlePlan = (plan) => {
    setPlan(plan)
  }

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const priceAfterFee = () => {
    return plan && Number((parseInt(price) * fee[plan]).toFixed(2))
  }

  return (
    <PaymentDrawer
      title={ <FormattedMessage id='payment.addfunds.headline' defaultMessage='Add funds' />}
      pickupTagListMessagesPrimaryText={<FormattedMessage id='payment.addfunds.headline.bounty.add' defaultMessage='Add a payment in advance and use it to pay for bounties' />}
      pickupTagListMessagesSecondaryText={<FormattedMessage id='payment.addfunds.subheading' defaultMessage='Add funds to your wallet and use it later to pay for bounties' />}
      onChangePrice={(price) => pickTaskPrice(price)}
      open={open}
      onClose={onClose}
      tabs={[
        {
          default: true,
          label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodInvoice),
          value: 'invoice',
          component: (
            <div>
              <Typography variant='body1' gutterBottom>
                <FormattedMessage id='task.payment.form.message.invoice.heading' defaultMessage='Invoice payment method' />
              </Typography>
            </div>
          )
        }
      ]}
    />
  )
}

export default injectIntl(AddFundsFormDrawer)
