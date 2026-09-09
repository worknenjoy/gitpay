import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ContributorProfileVariant from './contributor-profile-variant'
import { withPublicTemplate } from '../../../../../../../../.storybook/decorators/withPublicTemplate'

const meta = {
  title: 'Design Library/Pages/Public/UserProfile/Variants/Contributor',
  component: ContributorProfileVariant,
  decorators: [withPublicTemplate]
} satisfies Meta<typeof ContributorProfileVariant>

export default meta
type Story = StoryObj<typeof ContributorProfileVariant>

const baseProfile = {
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
    },
    {
      id: 3,
      title: 'Code review · 60 min',
      url: 'gitpay.me/p/alexandremagno/code-review',
      price: 120,
      paidCount: 22
    }
  ],
  bountyTabs: [
    { value: 'solved', label: 'Issues solved', count: 127 },
    { value: 'sponsored', label: 'Sponsored', count: 12 },
    { value: 'pull-requests', label: 'Pull requests', count: 142 }
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

const baseArgs = {
  completed: true,
  profile: baseProfile,
  bounties: { data: sampleBounties, completed: true },
  onHire: action('onHire'),
  onSponsor: action('onSponsor'),
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

export const Default: Story = {
  args: { ...baseArgs, defaultTab: 'services' }
}

export const BountiesTab: Story = {
  args: { ...baseArgs, defaultTab: 'bounties' }
}

export const ManyPaymentLinks: Story = {
  args: {
    ...baseArgs,
    defaultTab: 'services',
    profile: {
      ...baseProfile,
      paymentLinks: [
        ...baseProfile.paymentLinks,
        {
          id: 4,
          title: 'Sponsor a week of OSS work',
          url: 'gitpay.me/p/alexandremagno/sponsor-week',
          price: 420,
          paidCount: 11
        },
        {
          id: 5,
          title: 'Architecture review',
          url: 'gitpay.me/p/alexandremagno/architecture-review',
          price: 200,
          paidCount: 6
        },
        {
          id: 6,
          title: 'Onboarding session',
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
    defaultTab: 'bounties',
    profile: { ...baseProfile, skills: [], paymentLinks: [] },
    bounties: { data: [], completed: true }
  }
}

export const Loading: Story = {
  args: { ...baseArgs, defaultTab: 'services', completed: false }
}
