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

export const DirectChargeBreakdown: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: true,
    payment: {
      id: 4,
      source: 'pay_direct_charge_1',
      amount: '100.00',
      amount_after_fees: '89.63',
      currency: 'usd',
      status: 'paid',
      fee_breakdown: {
        gross: 100,
        processingFee: 5.37,
        platformFee: 5,
        platformFeePercent: 5,
        net: 89.63,
        directCharge: true
      },
      createdAt: '2026-11-24T13:48:06.000Z',
      PaymentRequest: {
        title: 'Direct charge payment request',
        provider: 'whop'
      },
      PaymentRequestCustomer: {
        email: 'customer@example.com'
      }
    }
  }
}

export const DirectChargeAwaitingNet: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: true,
    payment: {
      id: 5,
      source: 'pay_direct_charge_2',
      amount: '100.00',
      amount_after_fees: null,
      currency: 'usd',
      status: 'paid',
      fee_breakdown: {
        gross: 100,
        processingFee: null,
        platformFee: 5,
        platformFeePercent: 5,
        net: null,
        directCharge: true
      },
      createdAt: '2026-11-24T13:48:06.000Z',
      PaymentRequest: {
        title: 'Direct charge payment request',
        provider: 'whop'
      },
      PaymentRequestCustomer: {
        email: 'customer@example.com'
      }
    }
  }
}

export const PlatformBreakdown: Story = {
  args: {
    open: true,
    onClose: () => {},
    completed: true,
    payment: {
      id: 6,
      source: 'pay_platform_1',
      amount: '100.00',
      amount_after_fees: '94.37',
      currency: 'usd',
      status: 'paid',
      fee_breakdown: {
        gross: 100,
        processingFee: 5.63,
        platformFee: 7.55,
        platformFeePercent: 8,
        net: 86.82,
        directCharge: false
      },
      createdAt: '2026-11-24T13:48:06.000Z',
      PaymentRequest: {
        title: 'Platform payment request',
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
