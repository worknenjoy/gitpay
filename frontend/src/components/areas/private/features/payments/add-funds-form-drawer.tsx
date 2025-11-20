import React, { useState, useEffect } from 'react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

import PaymentDrawer from 'design-library/molecules/drawers/payment-drawer/payment-drawer'
import AddFundsInvoiceTab from './add-funds-invoice-tab'

const taskPaymentFormMessages = defineMessages({
  tabPaymentMethodCrediCard: {
    id: 'task.payment.method.card',
    defaultMessage: 'Credit Card',
  },
  tabPaymentMethodPaypal: {
    id: 'task.payment.method.paypal',
    defaultMessage: 'Paypal',
  },
  tabPaymentMethodInvoice: {
    id: 'task.payment.method.invoice',
    defaultMessage: 'Invoice',
  },
})

const AddFundsFormDrawer = ({ intl, open, onClose, customer, onPay }) => {
  const [price, setPrice] = useState(0)
  const [priceAfterFee, setPriceAfterFee] = useState(0)

  useEffect(() => {
    setPriceAfterFee(price * 1.08)
  }, [price])

  const pickTaskPrice = (price) => {
    setPrice(price)
  }

  return (
    <PaymentDrawer
      title={<FormattedMessage id="payment.addfunds.headline" defaultMessage="Add funds" />}
      pickupTagListMessagesPrimaryText={
        <FormattedMessage
          id="payment.addfunds.headline.bounty.add"
          defaultMessage="Add a payment in advance and use it to pay for bounties"
        />
      }
      pickupTagListMessagesSecondaryText={
        <FormattedMessage
          id="payment.addfunds.subheading"
          defaultMessage="Add funds to your wallet and use it later to pay for bounties"
        />
      }
      onChangePrice={(price) => pickTaskPrice(price)}
      open={open}
      onClose={onClose}
      plan={{
        fee: 0,
        category: (
          <FormattedMessage id="actions.wallet.funds.plan.title" defaultMessage="Wallet payment" />
        ),
        title: (
          <FormattedMessage
            id="actions.wallet.funds.plan.info"
            defaultMessage="Pay using your wallet"
          />
        ),
        items: [
          <FormattedMessage id="actions.wallet.plan.bullet.one" defaultMessage="No platform fee" />,
          <FormattedMessage
            id="actions.wallet.plan.bullet.two"
            defaultMessage="Use your funds to pay for bounties"
          />,
        ],
      }}
      tabs={[
        {
          default: true,
          label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodInvoice),
          value: 'invoice',
          component: (
            <AddFundsInvoiceTab
              priceAfterFee={price}
              price={price}
              onClose={onClose}
              customer={customer}
              onPay={onPay}
            />
          ),
        },
      ]}
    />
  )
}

export default injectIntl(AddFundsFormDrawer)
