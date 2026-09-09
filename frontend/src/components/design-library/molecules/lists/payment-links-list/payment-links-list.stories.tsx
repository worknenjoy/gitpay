import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import PaymentLinksList from './payment-links-list'

const meta: Meta<typeof PaymentLinksList> = {
  title: 'Design Library/Molecules/Lists/PaymentLinksList',
  component: PaymentLinksList,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof PaymentLinksList>

const sampleLinks = [
  {
    id: 1,
    title: 'Hire me · 1 hour pair session',
    description: 'Live pairing over a call — bug hunts, code review, or design discussion.',
    url: 'gitpay.me/p/alexandremagno/pair-1h',
    price: 90,
    paidCount: 41
  },
  {
    id: 2,
    title: 'Quick bug fix · TypeScript',
    description: 'A scoped, single bug fix in a TypeScript codebase, turned around fast.',
    url: 'gitpay.me/p/alexandremagno/quick-fix-ts',
    price: 80,
    paidCount: 28
  },
  {
    id: 3,
    title: 'Code review · 60 min',
    url: 'gitpay.me/p/alexandremagno/code-review',
    price: 120,
    paidCount: 22
  }
]

export const Default: Story = {
  args: {
    completed: true,
    links: sampleLinks,
    onPay: action('onPay')
  }
}

export const Empty: Story = {
  args: {
    completed: true,
    links: [],
    onPay: action('onPay')
  }
}

export const Loading: Story = {
  args: {
    completed: false,
    links: [],
    onPay: action('onPay')
  }
}
