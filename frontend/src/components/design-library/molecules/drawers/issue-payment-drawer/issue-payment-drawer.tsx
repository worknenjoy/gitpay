import React, { useEffect, useMemo, useState } from 'react'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'

import PaymentDrawer from 'design-library/molecules/drawers/payment-drawer/payment-drawer'

import PaymentDialog from '../../../../areas/private/features/payments/legacy/payment-dialog'
import PaypalPaymentDialog from '../../../../areas/private/features/payments/legacy/paypal-payment-dialog'
import PaymentMethodInvoiceTab from '../../../../areas/public/features/task/legacy/payment/methods/invoice/payment-method-invoice-tab'
import PaymentMethodWalletTab from '../../../../areas/public/features/task/legacy/payment/methods/wallet/payment-method-wallet-tab'

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

function IssuePaymentDrawer(props: any) {
  const intl = useIntl()
  const { open, onClose, fetchCustomer, customer } = props

  const [price, setPrice] = useState<number | string>(0)
  const [plan, setPlan] = useState<'open source' | 'private' | 'full'>('open source')

  useEffect(() => {
    if (props.task && props.task.data?.private) {
      setPlan('private')
    } else {
      setPlan('open source')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const feeValue = useMemo(() => {
    const numericPrice = Number(price) || 0
    if (plan === 'open source' && numericPrice >= 5000) return 0
    return plan === 'open source' ? 8 : 'cannot calculate fee'
  }, [plan, price])

  const priceAfterFee = useMemo(() => {
    const numericPrice = Number(price) || 0
    if (!numericPrice) return 0
    if (plan === 'open source' && feeValue === 0) return numericPrice
    return plan ? Number((parseInt(String(numericPrice), 10) * (fee as any)[plan]).toFixed(2)) : 0
  }, [plan, price, feeValue])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumSignificantDigits: 4
    }).format(amount)

  const pickTaskPrice = (p: number) => setPrice(p)

  return (
    <PaymentDrawer
      title={<FormattedMessage id="task.payment.headline" defaultMessage="New payment for an issue" />}
      pickupTagListMessagesPrimaryText={<FormattedMessage id="issue.payment.headline.bounty.add" defaultMessage="Add a bounty for this issue" />}
      pickupTagListMessagesSecondaryText={<FormattedMessage id="issue.payment.form.message.subheading" defaultMessage="Create a bounty for this issue and who you assign will receive the payment for this bounty" />}
      onChangePrice={(p) => pickTaskPrice(p)}
      open={open}
      onClose={onClose}
      plan={{
        fee: feeValue,
        category: <FormattedMessage id="actions.task.payment.plan.opensource" defaultMessage="Open Source" />,
        title: <FormattedMessage id="actions.task.payment.plan.opensource.info" defaultMessage="For Open Source Project" />,
        items: [
          feeValue === 0 ? <FormattedMessage key="noFee" id="actions.task.payment.plan.bullet.noFee" defaultMessage="No fee for issues equal or above 5000" /> : undefined,
          <FormattedMessage key="public" id="actions.task.payment.plan.bullet.public" defaultMessage="For Public Projects" />,
          <FormattedMessage key="basic" id="actions.task.payment.plan.bullet.basic" defaultMessage="Basic Campaign" />
        ]
      }}
      tabs={[
        {
          default: true,
          label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodCrediCard),
          value: 'card',
          component: (
            <PaymentDialog
              addNotification={props.addNotification}
              onPayment={props.updateTask}
              price={price}
              formatedPrice={formatCurrency(priceAfterFee as number)}
              user={props.user}
              task={props.match.params.id}
              plan={plan}
              onClose={onClose}
            />
          )
        },
        {
          label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodInvoice),
          value: 'invoice',
          component: (
            <PaymentMethodInvoiceTab
              priceAfterFee={priceAfterFee}
              fetchCustomer={fetchCustomer}
              customer={customer}
              user={props.user}
              createOrder={props.createOrder}
              task={props.task?.data}
              price={price}
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
              addNotification={props.addNotification}
              onPayment={props.updateTask}
              price={price}
              formatedPrice={formatCurrency(priceAfterFee as number)}
              taskId={props.match.params.id}
              createOrder={props.createOrder}
              user={props.user}
              order={props.order}
              plan={plan}
            />
          )
        },
        {
          label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodWallet),
          value: 'wallet',
          component: (
            <PaymentMethodWalletTab
              user={props.user}
              task={props.task?.data}
              price={price}
              priceAfterFee={priceAfterFee}
              plan={plan}
              createOrder={props.createOrder}
              fetchWallet={props.fetchWallet}
              wallet={props.wallet}
              listWallets={props.listWallets}
              wallets={props.wallets}
              onClose={onClose}
              fetchTask={props.fetchTask}
              syncTask={props.syncTask}
            />
          )
        }
      ]}
    />
  )
}

export default IssuePaymentDrawer
