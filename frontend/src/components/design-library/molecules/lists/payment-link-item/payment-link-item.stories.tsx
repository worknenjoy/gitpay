import type { Meta, StoryObj } from '@storybook/react'
import PaymentLinkItem from './payment-link-item'

const meta: Meta<typeof PaymentLinkItem> = {
  title: 'Design Library/Molecules/Lists/PaymentLinkItem',
  component: PaymentLinkItem,
  args: {
    link: {
      id: 1,
      title: 'Hire me · 1 hour pair session',
      currency: 'usd',
      amount: 90,
      payment_url: 'https://gitpay.me/p/alexandremagno/pair-1h',
      paidCount: 41
    }
  }
}
export default meta

type Story = StoryObj<typeof PaymentLinkItem>

export const Default: Story = {
  args: {
    onPay: () => {}
  }
}

export const WithoutPayAction: Story = {}
