import type { Meta, StoryObj } from '@storybook/react'
import PaymentRequestPaymentDetailsAction from './payment-request-payment-details-action'

const meta: Meta<typeof PaymentRequestPaymentDetailsAction> = {
  title: 'Design Library/Molecules/Drawers/Actions/Payments/PaymentRequestPaymentDetailsAction',
  component: PaymentRequestPaymentDetailsAction,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof PaymentRequestPaymentDetailsAction>

export const WhopWithFees: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: true,
    payment: {
      id: 1,
      source: 'pay_whop_gross_1',
      amount: '1.00',
      amount_after_fees: '0.57',
      currency: 'usd',
      status: 'paid',
      createdAt: '2026-08-09T12:54:00.000Z',
      updatedAt: '2026-08-09T12:54:00.000Z',
      PaymentRequest: {
        title: 'Support open source work',
        provider: 'whop'
      },
      PaymentRequestCustomer: {
        email: 'customer@example.com'
      }
    }
  }
}

export const WithoutFees: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: true,
    payment: {
      id: 2,
      source: 'pi_stripe_123',
      amount: '50.00',
      amount_after_fees: null,
      currency: 'usd',
      status: 'paid',
      createdAt: '2026-08-09T10:00:00.000Z',
      PaymentRequest: {
        title: 'Stripe payment request',
        provider: 'stripe'
      },
      PaymentRequestCustomer: {
        email: 'buyer@example.com'
      }
    }
  }
}

export const Refunded: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: true,
    payment: {
      id: 3,
      source: 'pay_refunded_1',
      amount: '1.00',
      amount_after_fees: '0.57',
      currency: 'usd',
      status: 'refunded',
      createdAt: '2026-08-09T12:54:00.000Z',
      updatedAt: '2026-08-10T09:00:00.000Z',
      PaymentRequest: {
        title: 'Refunded request',
        provider: 'whop'
      },
      PaymentRequestCustomer: {
        email: 'customer@example.com'
      }
    }
  }
}

export const Loading: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: false,
    payment: null
  }
}
