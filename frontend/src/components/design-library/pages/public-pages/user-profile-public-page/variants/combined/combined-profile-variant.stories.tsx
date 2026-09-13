import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import CombinedProfileVariant from './combined-profile-variant'
import { withPublicTemplate } from '../../../../../../../../.storybook/decorators/withPublicTemplate'

const meta = {
  title: 'Design Library/Pages/Public/UserProfile/Variants/Combined',
  component: CombinedProfileVariant,
  decorators: [withPublicTemplate]
} satisfies Meta<typeof CombinedProfileVariant>

export default meta
type Story = StoryObj<typeof CombinedProfileVariant>

const contributorProfile = {
  username: 'alexandremagno',
  name: 'Alexandre Magno',
  website: 'https://blog.alexandremagno.net/en',
  country: 'BR',
  profile_url: 'https://github.com/alexandremagno',
  picture_url: '',
  verified: true,
  role: { name: 'contributor', tone: 'orange' as const },
  identity: ['Joined Mar 2019', '127 issues solved'],
  availability: [{ label: 'Open for job opportunities', active: true }],
  skills: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'GraphQL', 'PostgreSQL'],
  paymentLinks: [
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
      url: 'gitpay.me/p/alexandremagno/quick-fix-ts',
      price: 80,
      paidCount: 28
    }
  ],
  bountyTabs: [
    { value: 'solved', label: 'Issues solved', count: 127 },
    { value: 'pull-requests', label: 'Pull requests', count: 142 }
  ]
}

const providerProfile = {
  username: 'alexandremagno',
  name: 'Alexandre Magno',
  website: 'https://blog.alexandremagno.net/en',
  country: 'BR',
  profile_url: 'https://github.com/alexandremagno',
  picture_url: '',
  verified: true,
  role: { name: 'service provider', tone: 'yellow' as const },
  identity: ['Provider since 2021', '52 payments'],
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
    }
  ]
}

const sampleBounties = [
  {
    id: 1101,
    title: 'When accept the terms in account settings, redirect fails',
    status: 'closed',
    value: 50,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/1101',
    Labels: [
      { id: 'bug', name: 'bug' },
      { id: 'good-first-issue', name: 'good first issue' }
    ],
    Project: {
      id: 1,
      OrganizationId: 1,
      name: 'gitpay',
      ProgrammingLanguages: [
        { id: 'ts', name: 'TypeScript' },
        { id: 'mdx', name: 'MDX' }
      ]
    },
    createdAt: '2024-11-02T10:00:00Z'
  },
  {
    id: 980,
    title: 'Update readme with new setup instructions',
    status: 'open',
    value: 0,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/980',
    Labels: [{ id: 'first-issue', name: 'first-issue' }],
    Project: {
      id: 1,
      OrganizationId: 1,
      name: 'gitpay',
      ProgrammingLanguages: [{ id: 'mdx', name: 'MDX' }]
    },
    createdAt: '2019-05-14T10:00:00Z'
  },
  {
    id: 842,
    title: 'Deadline in the issue page revisited',
    status: 'closed',
    value: 43.2,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/842',
    Labels: [
      { id: 'help-wanted', name: 'help wanted' },
      { id: 'react', name: 'react' }
    ],
    Project: {
      id: 1,
      OrganizationId: 1,
      name: 'gitpay',
      ProgrammingLanguages: [
        { id: 'mdx', name: 'MDX' },
        { id: 'html', name: 'HTML' }
      ]
    },
    createdAt: '2023-03-08T10:00:00Z'
  }
]

const samplePullRequests = [
  {
    id: 1,
    pullRequestURL: 'https://github.com/worknenjoy/gitpay/pull/1101',
    isPRMerged: true,
    isIssueClosed: true,
    createdAt: '2024-11-02T10:00:00Z',
    Task: { id: 1101, title: 'When accept the terms in account settings, redirect fails' }
  }
]

const baseArgs = {
  completed: true,
  contributorProfile,
  providerProfile,
  bounties: { data: sampleBounties, completed: true },
  pullRequests: { data: samplePullRequests, completed: true },
  onPayLink: action('onPayLink'),
  onViewBounty: action('onViewBounty'),
  onBountyTabChange: action('onBountyTabChange'),
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

export const Overview: Story = {
  args: { ...baseArgs, defaultView: 'overview' }
}

export const Contributor: Story = {
  args: { ...baseArgs, defaultView: 'contributor' }
}

export const ServiceProvider: Story = {
  args: { ...baseArgs, defaultView: 'provider' }
}
