import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import InvoicePaymentCard from './invoice-payment-card'

const meta: Meta = {
  title: 'Design Library/Molecules/Cards/PaymentCards/InvoicePaymentCard',
  component: InvoicePaymentCard,
  parameters: {
    layout: 'centered'
  }
}

export default meta

type Story = StoryObj<any>

export const Default: Story = {
  args: {
    customer: {
      completed: true,
      data: {
        id: 1,
        name: 'Jane Doe',
        address: '123 Main St, Anytown, USA',
        email: 'jane.doe@example.com'
      }
    },
    user: {
      completed: true,
      data: {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com'
      }
    },
    task: {
      completed: true,
      data: {
        id: 1,
        title: 'Sample Task'
      }
    },
    invoiceNumber: 'INV-001',
    amount: 199.99,
    currency: 'USD',
    dueDate: '2025-10-15',
    status: 'pending',
    payeeName: 'Acme Corp',
    // If your component supports actions/callbacks:
    onPay: action('onPay'),
    price: 200,
    priceAfterFee: 180,
    fetchCustomer: action('fetchCustomer'),
    createOrder: action('createOrder'),
    onPayment: action('onPayment')
  }
}

export const Loading: Story = {
  args: {
    ...Default.args,
    customer: {
      completed: false,
      data: {}
    },
    user: {
      completed: false,
      data: {}
    },
    task: {
      completed: false,
      data: {}
    }
  }
}

export const NoCustomer: Story = {
  args: {
    ...Default.args,
    customer: {
      completed: true,
      data: {}
    }
  }
}
