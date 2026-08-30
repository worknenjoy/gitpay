import type { Meta, StoryObj } from '@storybook/react'
import ServicePackageCard from './service-package-card'

const meta: Meta<typeof ServicePackageCard> = {
  title: 'Design Library/Molecules/Cards/ServicePackageCard',
  component: ServicePackageCard,
  parameters: { layout: 'centered' }
}
export default meta

type Story = StoryObj<typeof ServicePackageCard>

export const Starter: Story = {
  args: {
    tier: 'Starter',
    price: '$120',
    priceSuffix: '/ session',
    features: ['1 hour code review', 'Written summary & follow-ups', '48-hour turnaround'],
    ctaLabel: 'Book starter'
  }
}

export const Featured: Story = {
  args: {
    tier: 'Standard',
    price: '$600',
    priceSuffix: '/ project',
    features: [
      'Custom integration or feature',
      'Code, tests, and docs',
      '2 weeks of follow-up support',
      'Stripe-verified escrow'
    ],
    featured: true,
    ctaLabel: 'Start project'
  }
}
