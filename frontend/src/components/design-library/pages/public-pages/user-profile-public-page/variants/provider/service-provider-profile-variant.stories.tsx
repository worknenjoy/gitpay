import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ServiceProviderProfileVariant from './service-provider-profile-variant'
import { withPublicTemplate } from '../../../../../../../../.storybook/decorators/withPublicTemplate'

const meta = {
  title: 'Design Library/Pages/Public/UserProfile/Variants/ServiceProvider',
  component: ServiceProviderProfileVariant,
  decorators: [withPublicTemplate]
} satisfies Meta<typeof ServiceProviderProfileVariant>

export default meta
type Story = StoryObj<typeof ServiceProviderProfileVariant>

const baseProfile = {
  username: 'alexandremagno',
  name: 'Alexandre Magno',
  website: 'https://blog.alexandremagno.net/en',
  country: 'BR',
  profile_url: 'https://github.com/alexandremagno',
  picture_url: '',
  verified: true,
  role: { name: 'service provider', tone: 'yellow' as const },
  identity: ['Provider since 2021', '147 payments'],
  paymentLinks: [
    {
      id: 1,
      title: 'Code review · 1 hour deep dive',
      description:
        'A focused 1:1 walkthrough of your PR or architecture, with written notes after.',
      url: 'gitpay.me/p/alexandremagno/code-review-1h',
      price: 120,
      paidCount: 38
    },
    {
      id: 2,
      title: 'Stripe / payments integration',
      description: 'End-to-end Stripe setup: webhooks, checkout, and payout reconciliation.',
      url: 'gitpay.me/p/alexandremagno/stripe-setup',
      price: 800,
      paidCount: 14
    },
    {
      id: 3,
      title: 'Open-source mentoring · 4 sessions',
      url: 'gitpay.me/p/alexandremagno/oss-mentor-4x',
      price: 360,
      paidCount: 22
    },
    {
      id: 4,
      title: 'Custom GitHub Action',
      url: 'gitpay.me/p/alexandremagno/gha-custom',
      price: 600,
      paidCount: 9
    },
    {
      id: 5,
      title: 'Office hour · 30 min · pay-what-you-can',
      url: 'gitpay.me/p/alexandremagno/office-hour',
      price: 30,
      paidCount: 64
    }
  ]
}

const baseArgs = {
  completed: true,
  profile: baseProfile,
  onPayLink: action('onPayLink'),
  // Bottom stats bar reads this via the withPublicTemplate decorator's `bottomBarProps` —
  // without it `info` is undefined and the footer stays in its loading-skeleton state.
  bottomBarProps: {
    info: {
      completed: true,
      data: {
        tasks: 501,
        bounties: 25432,
        users: 4871,
        paymentRequestPaymentsCount: 0,
        totalPaidForPaymentRequests: 0,
        userCountriesCount: 42
      }
    },
    getInfo: () => {}
  }
}

export const Default: Story = {
  args: baseArgs
}

export const ManyPaymentLinks: Story = {
  args: {
    ...baseArgs,
    profile: {
      ...baseProfile,
      paymentLinks: [
        ...baseProfile.paymentLinks,
        {
          id: 6,
          title: 'Architecture review',
          url: 'gitpay.me/p/alexandremagno/architecture-review',
          price: 200,
          paidCount: 6
        },
        {
          id: 7,
          title: 'On-call incident support · per hour',
          url: 'gitpay.me/p/alexandremagno/on-call',
          price: 150,
          paidCount: 3
        },
        {
          id: 8,
          title: 'Onboarding session for new maintainers',
          url: 'gitpay.me/p/alexandremagno/onboarding',
          price: 60,
          paidCount: 34
        }
      ]
    }
  }
}

export const EmptyState: Story = {
  args: {
    ...baseArgs,
    profile: { ...baseProfile, paymentLinks: [] }
  }
}

export const Loading: Story = {
  args: { ...baseArgs, completed: false }
}
