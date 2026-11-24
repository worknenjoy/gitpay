import type { Meta, StoryObj } from '@storybook/react'
import BountyPaymentsList from './bounty-payments-list'

const meta: Meta<typeof BountyPaymentsList> = {
  title: 'Design Library/Molecules/Lists/BountyPaymentsList',
  component: BountyPaymentsList,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof BountyPaymentsList>

const advance = [
  {
    id: 1,
    sponsor: {
      name: 'worknenjoy',
      verified: true,
      reputation: { paid: 64, total: '$9,840', open: 4 }
    },
    amount: 200,
    method: 'card',
    state: 'paid',
    date: '2026-11-10'
  },
  {
    id: 2,
    sponsor: { name: 'defnax', verified: true, reputation: { paid: 12, total: '$1,150', open: 1 } },
    amount: 100,
    method: 'invoice',
    state: 'paid',
    date: '2026-11-14'
  },
  {
    id: 3,
    sponsor: { name: 'Anonymous', anonymous: true },
    amount: 50,
    method: 'wallet',
    state: 'paid',
    date: '2026-11-18'
  }
] as any[]

export const PaidInAdvance: Story = { args: { payments: advance } }

export const Flexible: Story = {
  args: {
    payments: [
      advance[0],
      { ...advance[1], state: 'pledged' },
      { ...advance[2], state: 'pending', method: 'invoice' }
    ]
  }
}

export const TodayData: Story = {
  args: {
    payments: [
      {
        id: 1,
        sponsor: { name: 'worknenjoy' },
        amount: 200,
        method: 'card',
        state: 'paid',
        date: '2026-11-10'
      },
      {
        id: 2,
        sponsor: { name: 'Anonymous', anonymous: true },
        amount: 50,
        method: 'card',
        state: 'paid'
      }
    ]
  }
}
