import type { Meta, StoryObj } from '@storybook/react'
import ProviderProfilePage from './provider-profile-page'

const meta: Meta<typeof ProviderProfilePage> = {
  title: 'Design Library/Pages/Public Pages/ProviderProfilePage',
  component: ProviderProfilePage,
  args: {
    profile: {
      id: 1,
      name: 'Alexandre Magno',
      username: 'alexandremagno',
      picture_url: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
      profile_url: 'https://github.com/alexandremagno',
      website: 'https://blog.alexandremagno.net/en'
    },
    stats: {
      jobsDeliveredCount: 147,
      totalReceived: 38420,
      activeLinksCount: 5,
      repeatClientsPct: 62,
      providerSince: '2021-03-01T00:00:00.000Z'
    },
    paymentLinks: [
      {
        id: 1,
        title: 'Standard',
        description:
          'Custom integration or feature\nCode, tests, and docs\n2 weeks of follow-up support',
        currency: 'usd',
        amount: 600,
        tier: 'Standard',
        featured: true,
        payment_url: 'https://gitpay.me/p/alexandremagno/standard'
      },
      {
        id: 2,
        title: 'Code review · 1 hour deep dive',
        currency: 'usd',
        amount: 120,
        payment_url: 'https://gitpay.me/p/alexandremagno/code-review-1h',
        paidCount: 38
      },
      {
        id: 3,
        title: 'Stripe / payments integration',
        currency: 'usd',
        amount: 800,
        payment_url: 'https://gitpay.me/p/alexandremagno/stripe-setup',
        paidCount: 14
      }
    ],
    onPay: () => {}
  },
  parameters: { layout: 'fullscreen' }
}
export default meta

type Story = StoryObj<typeof ProviderProfilePage>

export const Default: Story = {}
