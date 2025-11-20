import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import PayPalPaymentCard, { PaypalPaymentCardProps } from './paypal-payment-card'

const meta: Meta<typeof PayPalPaymentCard> = {
  title: 'Design Library/Molecules/Cards/PaymentCards/PayPalPaymentCard',
  component: PayPalPaymentCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<PaypalPaymentCardProps>

export const Default: Story = {
  args: {
    taskId: 123,
    plan: 'basic',
    price: 20,
    user: {},
    order: {
      completed: true,
      data: {},
    },
    createOrder: () =>
      Promise.resolve({
        data: { payment_url: 'https://www.paypal.com/checkoutnow?token=EC-60U79048BN7719609' },
      }),
    onClose: () => {},
  },
}

export const LoggedIn: Story = {
  args: {
    ...Default.args,
    user: {
      completed: true,
      data: {
        id: 1,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      },
    },
  },
}

export const ProcessingOrder: Story = {
  args: {
    ...Default.args,
    user: {
      completed: false,
      data: null,
    },
    order: {
      completed: false,
      data: null,
    },
  },
}
