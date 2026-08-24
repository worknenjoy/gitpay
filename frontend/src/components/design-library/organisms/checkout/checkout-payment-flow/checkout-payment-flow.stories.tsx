import React, { useState } from 'react'
import CheckoutPaymentFlow, { CheckoutPaymentFlowCheckout } from './checkout-payment-flow'

export default {
  title: 'Design Library/Organisms/Checkout/CheckoutPaymentFlow',
  component: CheckoutPaymentFlow
}

/**
 * Fully interactive: mimics the real page's state machine (amount entry → mint →
 * payment details → change amount) with a fake network delay instead of a real
 * API call. The embedded Whop iframe itself won't load for the fake session id
 * (no real backend here) — that's expected; this story is for the surrounding
 * flow/layout/state transitions, not the live Whop widget.
 */
const InteractiveTemplate = (args) => {
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [checkout, setCheckout] = useState<CheckoutPaymentFlowCheckout | null>(null)
  const [paid, setPaid] = useState(false)

  const handleContinue = () => {
    if (!amount || Number(amount) <= 0) return
    setSubmitError(null)
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setCheckout({ sessionId: 'session_demo_123', purchaseUrl: 'https://whop.com/checkout/demo' })
    }, 600)
  }

  const handleChangeAmount = () => {
    setCheckout(null)
    setSubmitError(null)
  }

  return (
    <CheckoutPaymentFlow
      {...args}
      amount={amount}
      onAmountChange={setAmount}
      onContinue={handleContinue}
      onChangeAmount={handleChangeAmount}
      submitting={submitting}
      submitError={submitError}
      checkout={checkout}
      paid={paid}
      onPaymentComplete={() => setPaid(true)}
    />
  )
}

export const Interactive = InteractiveTemplate.bind({})
Interactive.args = {
  title: 'React performance audit & fixes',
  description: 'Payment request from gitpay.me',
  currency: 'usd'
}

const StaticTemplate = (args) => <CheckoutPaymentFlow {...args} />

export const AmountEntry = StaticTemplate.bind({})
AmountEntry.args = {
  title: 'React performance audit & fixes',
  description: 'Payment request from gitpay.me',
  currency: 'usd',
  amount: '',
  onAmountChange: () => {},
  onContinue: () => {},
  onChangeAmount: () => {},
  onPaymentComplete: () => {},
  checkout: null
}

export const Submitting = StaticTemplate.bind({})
Submitting.args = {
  ...AmountEntry.args,
  amount: '25',
  submitting: true
}

export const WithError = StaticTemplate.bind({})
WithError.args = {
  ...AmountEntry.args,
  amount: '25',
  submitError: 'Could not start checkout. Please try again.'
}

export const PaymentDetails = StaticTemplate.bind({})
PaymentDetails.args = {
  ...AmountEntry.args,
  amount: '25',
  checkout: { sessionId: 'session_demo_123', purchaseUrl: 'https://whop.com/checkout/demo' }
}

export const Paid = StaticTemplate.bind({})
Paid.args = {
  ...AmountEntry.args,
  amount: '25',
  checkout: { sessionId: 'session_demo_123', purchaseUrl: 'https://whop.com/checkout/demo' },
  paid: true
}
