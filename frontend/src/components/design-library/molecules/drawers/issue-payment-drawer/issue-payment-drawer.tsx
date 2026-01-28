import React, { useEffect, useMemo, useState } from 'react'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'

import PaymentDrawer from 'design-library/molecules/drawers/payment-drawer/payment-drawer'

import CreditCardPaymentCard from 'design-library/molecules/cards/payment-cards/credit-card-payment-card/credit-card-payment-card'
import InvoicePaymentCard from '../../cards/payment-cards/invoice-payment-card/invoice-payment-card'
import PaymentMethodWalletTab from '../../cards/payment-cards/wallet-payment-card/wallet-payment-card'
import PaypalPaymentCard from '../../cards/payment-cards/paypal-payment-card/paypal-payment-card'

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

const fee = { 'open source': 1.08, private: 1.18, full: 1.3 }

function IssuePaymentDrawer({
  open,
  onClose,
  fetchCustomer,
  customer,
  addNotification,
  updateTask,
  user,
  task,
  createOrder,
  order,
  fetchWallet,
  wallet,
  listWallets,
  wallets,
  fetchTask,
  syncTask
}: any) {
  const intl = useIntl()

  const [price, setPrice] = useState<number | string>(0)
  const [plan, setPlan] = useState<'open source' | 'private' | 'full'>('open source')

  useEffect(() => {
    if (task && task.data?.private) {
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
      title={
        <FormattedMessage id="task.payment.headline" defaultMessage="New payment for an issue" />
      }
      pickupTagListMessagesPrimaryText={
        <FormattedMessage
          id="issue.payment.headline.bounty.add"
          defaultMessage="Add a bounty for this issue"
        />
      }
      pickupTagListMessagesSecondaryText={
        <FormattedMessage
          id="issue.payment.form.message.subheading"
          defaultMessage="Create a bounty for this issue and who you assign will receive the payment for this bounty"
        />
      }
      onChangePrice={(p) => pickTaskPrice(p)}
      open={open}
      onClose={onClose}
      plan={{
        fee: feeValue,
        category: (
          <FormattedMessage
            id="actions.task.payment.plan.opensource"
            defaultMessage="Open Source"
          />
        ),
        title: (
          <FormattedMessage
            id="actions.task.payment.plan.opensource.info"
            defaultMessage="For Open Source Project"
          />
        ),
        items: [
          feeValue === 0 ? (
            <FormattedMessage
              key="noFee"
              id="actions.task.payment.plan.bullet.noFee"
              defaultMessage="No fee for issues equal or above 5000"
            />
          ) : undefined,
          <FormattedMessage
            key="public"
            id="actions.task.payment.plan.bullet.public"
            defaultMessage="For Public Projects"
          />,
          <FormattedMessage
            key="basic"
            id="actions.task.payment.plan.bullet.basic"
            defaultMessage="Basic Campaign"
          />
        ]
      }}
      tabs={[
        {
          default: true,
          label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodCrediCard),
          value: 'card',
          component: (
            <CreditCardPaymentCard
              addNotification={addNotification}
              onPayment={updateTask}
              price={price}
              formatedPrice={formatCurrency(priceAfterFee as number)}
              user={user?.data}
              task={task?.data}
              plan={plan}
              onClose={onClose}
            />
          )
        },
        {
          label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodInvoice),
          value: 'invoice',
          component: (
            <InvoicePaymentCard
              priceAfterFee={priceAfterFee}
              fetchCustomer={fetchCustomer}
              customer={customer}
              user={user?.data}
              createOrder={createOrder}
              task={task?.data}
              price={price}
              onPayment={onClose}
            />
          )
        },
        {
          label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodPaypal),
          value: 'paypal',
          component: (
            <PaypalPaymentCard
              onClose={onClose}
              price={price}
              taskId={task?.data?.id}
              createOrder={createOrder}
              user={user?.data}
              order={order}
              plan={plan}
            />
          )
        },
        {
          label: intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodWallet),
          value: 'wallet',
          component: (
            <PaymentMethodWalletTab
              user={user?.data}
              task={task?.data}
              price={price}
              priceAfterFee={priceAfterFee}
              createOrder={createOrder}
              fetchWallet={fetchWallet}
              wallet={wallet}
              listWallets={listWallets}
              wallets={wallets}
              onClose={onClose}
              fetchTask={fetchTask}
              syncTask={syncTask}
            />
          )
        }
      ]}
    />
  )
}

export default IssuePaymentDrawer
