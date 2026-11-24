import React, { useEffect, useMemo, useState } from 'react'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { InputAdornment } from '@mui/material'
import { InfoOutlined as InfoIcon } from '@mui/icons-material'

import Drawer from 'design-library/molecules/drawers/drawer/drawer'
import PlanCard from 'design-library/molecules/cards/plan-card/plan-card'
import PaymentTimingAlert from 'design-library/atoms/alerts/payment-timing-alert/payment-timing-alert'
import CreditCardPaymentCard from 'design-library/molecules/cards/payment-cards/credit-card-payment-card/credit-card-payment-card'
import InvoicePaymentCard from '../../cards/payment-cards/invoice-payment-card/invoice-payment-card'
import PaymentMethodWalletTab from '../../cards/payment-cards/wallet-payment-card/wallet-payment-card'
import {
  Section,
  SectionLabel,
  Amounts,
  Pills,
  Pill,
  AmountInput,
  FeeLine,
  Methods,
  Method,
  Radio,
  MethodText,
  Note
} from './issue-payment-drawer.styles'

const messages = defineMessages({
  title: { id: 'issue.addBounty.title', defaultMessage: 'Add a bounty to this issue' },
  lede: {
    id: 'issue.addBounty.lede',
    defaultMessage:
      'Fund this issue so contributors know there is money for a solution. It is paid out when a solution is merged.'
  },
  amount: { id: 'issue.addBounty.amount', defaultMessage: 'Amount' },
  payWith: { id: 'issue.addBounty.payWith', defaultMessage: 'Pay with' },
  card: { id: 'task.payment.method.card', defaultMessage: 'Credit Card' },
  cardDescription: {
    id: 'issue.addBounty.method.card.description',
    defaultMessage: 'Charged now. Bounty is funded right away.'
  },
  invoice: { id: 'task.payment.method.invoice', defaultMessage: 'Invoice' },
  invoiceDescription: {
    id: 'issue.addBounty.method.invoice.description',
    defaultMessage: 'For companies. Pay by bank transfer before the due date.'
  },
  wallet: { id: 'task.payment.method.wallet', defaultMessage: 'Wallet' },
  walletDescription: {
    id: 'issue.addBounty.method.wallet.description',
    defaultMessage: 'Use funds you already added to Gitpay.'
  },
  cancel: { id: 'task.bounties.actions.cancel', defaultMessage: 'Cancel' },
  pledge: { id: 'issue.addBounty.pledge', defaultMessage: 'Pledge {amount}' }
})

export type AddBountyMethod = 'card' | 'invoice' | 'wallet'

const fee = { 'open source': 1.08, private: 1.18, full: 1.3 }
const PRESETS = [50, 100, 250, 500]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 4
  }).format(amount)

/**
 * Add bounty drawer. Amount + how to pay (card, invoice or wallet). Each method's
 * body is the existing payment card, so creating the order works exactly as before.
 * Pay later is offered only when `onPledge` is provided.
 */
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
  fetchWallet,
  wallet,
  listWallets,
  wallets,
  fetchTask,
  syncTask,
  price: initialPrice,
  initialMethod = 'card',
  initialWhen = 'now',
  onPledge
}: any) {
  const intl = useIntl()

  const [price, setPrice] = useState<number | string>(initialPrice || 0)
  const [plan, setPlan] = useState<'open source' | 'private' | 'full'>('open source')
  const [method, setMethod] = useState<AddBountyMethod>(initialMethod)
  const [when, setWhen] = useState<'now' | 'later'>(onPledge ? initialWhen : 'now')

  useEffect(() => {
    if (task && task.data?.private) {
      setPlan('private')
    } else {
      setPlan('open source')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (open) setWhen(onPledge ? initialWhen : 'now')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialWhen])

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

  const later = when === 'later'
  const amount = Number(price) || 0

  const methods: { id: AddBountyMethod; label: string; description: string }[] = [
    {
      id: 'card',
      label: intl.formatMessage(messages.card),
      description: intl.formatMessage(messages.cardDescription)
    },
    {
      id: 'invoice',
      label: intl.formatMessage(messages.invoice),
      description: intl.formatMessage(messages.invoiceDescription)
    },
    {
      id: 'wallet',
      label: intl.formatMessage(messages.wallet),
      description: intl.formatMessage(messages.walletDescription)
    }
  ]

  const methodBody = {
    card: (
      <CreditCardPaymentCard
        addNotification={addNotification}
        onPayment={updateTask}
        createOrder={createOrder}
        price={price}
        formatedPrice={formatCurrency(priceAfterFee as number)}
        user={user?.data}
        task={task?.data}
        plan={plan}
        onClose={onClose}
      />
    ),
    invoice: (
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
    ),
    wallet: (
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

  const actions = [
    {
      label: intl.formatMessage(messages.cancel),
      onClick: onClose,
      variant: 'text',
      color: 'primary'
    },
    ...(later && onPledge
      ? [
          {
            label: intl.formatMessage(messages.pledge, { amount: formatCurrency(amount) }),
            onClick: () => onPledge(amount),
            variant: 'contained',
            color: 'primary',
            disabled: !amount
          }
        ]
      : [])
  ]

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={intl.formatMessage(messages.title)}
      subtitle={intl.formatMessage(messages.lede)}
      actions={actions}
    >
      <Section>
        <SectionLabel>{intl.formatMessage(messages.amount)}</SectionLabel>
        <Amounts>
          <Pills>
            {PRESETS.map((preset) => (
              <Pill
                key={preset}
                type="button"
                data-on={amount === preset}
                onClick={() => setPrice(preset)}
              >
                ${preset}
              </Pill>
            ))}
          </Pills>
          <AmountInput
            size="small"
            type="number"
            value={price || ''}
            onChange={(e) => setPrice(e.target.value)}
            inputProps={{ min: 0, 'aria-label': intl.formatMessage(messages.amount) }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: <InputAdornment position="end">USD</InputAdornment>
            }}
          />
          {!later && (
            <PlanCard
              variant="compact"
              plan={{
                fee: plan === 'private' ? 18 : (feeValue as number),
                category:
                  plan === 'private' ? (
                    <FormattedMessage
                      id="actions.task.payment.plan.private"
                      defaultMessage="Private"
                    />
                  ) : (
                    <FormattedMessage
                      id="actions.task.payment.plan.opensource"
                      defaultMessage="Open Source"
                    />
                  )
              }}
            />
          )}
        </Amounts>
        {!later && amount > 0 && (
          <FeeLine>
            {feeValue === 0 ? (
              <FormattedMessage
                id="actions.task.payment.plan.bullet.noFee"
                defaultMessage="No fee for issues equal or above 5000"
              />
            ) : (
              <FormattedMessage
                id="issue.addBounty.totalWithFee"
                defaultMessage="Total with fee: {total}"
                values={{ total: <b>{formatCurrency(priceAfterFee as number)}</b> }}
              />
            )}
          </FeeLine>
        )}
      </Section>

      <Section>
        <PaymentTimingAlert
          timing={later ? 'later' : 'advance'}
          description={
            later ? (
              <FormattedMessage
                id="issue.addBounty.later.description"
                defaultMessage="Nothing is charged now. You pay when a solution is accepted."
              />
            ) : (
              <FormattedMessage
                id="issue.addBounty.now.description"
                defaultMessage="Charged now. Gitpay holds it and releases it when a solution is merged."
              />
            )
          }
          onSwitch={onPledge ? () => setWhen(later ? 'now' : 'later') : undefined}
        />
      </Section>

      {!later && (
        <Section>
          <SectionLabel>{intl.formatMessage(messages.payWith)}</SectionLabel>
          <Methods role="radiogroup">
            {methods.map((option) => (
              <Method
                key={option.id}
                type="button"
                role="radio"
                aria-checked={method === option.id}
                data-on={method === option.id}
                onClick={() => setMethod(option.id)}
              >
                <Radio />
                <MethodText>
                  <b>{option.label}</b>
                  <em>{option.description}</em>
                </MethodText>
              </Method>
            ))}
          </Methods>
          {methodBody[method]}
        </Section>
      )}

      <Note>
        <InfoIcon />
        {later ? (
          <FormattedMessage
            id="issue.addBounty.note.later"
            defaultMessage="Your pledge shows on the issue as estimated. You get a payment request when a solution is accepted, and choose card, invoice or wallet then."
          />
        ) : method === 'invoice' ? (
          <FormattedMessage
            id="issue.addBounty.note.invoice"
            defaultMessage='The issue shows "Invoice pending" until payment arrives, then switches to Funded. Refunded if the issue closes without a merged solution.'
          />
        ) : method === 'wallet' ? (
          <FormattedMessage
            id="issue.addBounty.note.wallet"
            defaultMessage="Refunded to your wallet if the issue closes without a merged solution."
          />
        ) : (
          <FormattedMessage
            id="issue.addBounty.note.card"
            defaultMessage="Refunded if the issue closes without a merged solution."
          />
        )}
      </Note>
    </Drawer>
  )
}

export default IssuePaymentDrawer
