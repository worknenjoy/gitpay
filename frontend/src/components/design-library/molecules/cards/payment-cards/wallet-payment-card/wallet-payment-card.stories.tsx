import type { Meta, StoryObj } from '@storybook/react'
import WalletPaymentCard from './wallet-payment-card'

const meta: Meta<typeof WalletPaymentCard> = {
  title: 'Design Library/Molecules/Cards/PaymentCards/WalletPaymentCard',
  component: WalletPaymentCard,
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof WalletPaymentCard>

export const Default: Story = {
  args: {
    user: {},
    task: { id: 123 },
    price: 20,
    priceAfterFee: 18,
    wallet: {
      completed: true,
      data: {
        balance: 0,
        name: 'My Wallet',
        id: 1,
      },
    },
    fetchWallet: () => Promise.resolve({ data: { balance: 0 } }),
    createOrder: () => Promise.resolve({ data: {} }),
  },
}

export const LoggedIn: Story = {
  args: {
    ...Default.args,
    user: {
      completed: true,
      data: { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' },
    },
  },
}

export const WithWallet: Story = {
  args: {
    ...LoggedIn.args,
    wallet: {
      completed: true,
      data: { id: 1, name: 'My Wallet', balance: 50 },
    },
  },
}

export const InsufficientFunds: Story = {
  args: {
    ...WithWallet.args,
    price: 60,
    priceAfterFee: 54,
  },
}

export const LoadingWallet: Story = {
  args: {
    ...LoggedIn.args,
    wallet: {
      completed: false,
      data: null,
    },
  },
}
