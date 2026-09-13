import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import MaintainerProfileVariant from './maintainer-profile-variant'
import { withPublicTemplate } from '../../../../../../../../.storybook/decorators/withPublicTemplate'

const meta = {
  title: 'Design Library/Pages/Public/UserProfile/Variants/Maintainer',
  component: MaintainerProfileVariant,
  decorators: [withPublicTemplate]
} satisfies Meta<typeof MaintainerProfileVariant>

export default meta
type Story = StoryObj<typeof MaintainerProfileVariant>

const baseProfile = {
  username: 'alexandremagno',
  name: 'Alexandre Magno',
  website: 'https://blog.alexandremagno.net/en',
  country: 'BR',
  profile_url: 'https://github.com/alexandremagno',
  picture_url: '',
  verified: true,
  role: { name: 'maintainer', tone: 'teal' as const },
  identity: ['Maintaining since 2019', '4 active projects'],
  availability: [
    { label: 'Active this week', active: true },
    { label: 'Accepting sponsors', active: true }
  ],
  stats: ['215 contributors across repos', '$17,020 paid out']
}

const org = { id: 1, name: 'worknenjoy', provider: 'github' }

const sampleProjects = [
  {
    id: 1,
    name: 'gitpay',
    Organization: org,
    description: 'Payment platform for open-source work delivered.',
    languages: ['TypeScript', 'React', 'Node'],
    Tasks: [
      { id: 1, status: 'open', value: 0 },
      { id: 2, status: 'open', value: 0 },
      { id: 3, status: 'closed', value: 50 },
      { id: 4, status: 'closed', value: 40 }
    ]
  },
  {
    id: 2,
    name: 'issue-bounty',
    Organization: org,
    description: 'GitHub Action that posts bounties to PR threads automatically.',
    languages: ['TypeScript', 'Shell'],
    Tasks: [
      { id: 5, status: 'open', value: 0 },
      { id: 6, status: 'closed', value: 120 }
    ]
  },
  {
    id: 3,
    name: 'explore',
    Organization: org,
    description: 'Discovery surface for funded issues across thousands of repos.',
    languages: ['JavaScript', 'CSS'],
    Tasks: [{ id: 7, status: 'open', value: 0 }]
  }
]

const sampleOpenBounties = [
  {
    id: 2201,
    title: 'Server side rendering for /explore',
    status: 'open',
    value: 200,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/2201',
    Labels: [{ id: 'enhancement', name: 'enhancement' }],
    Project: {
      id: 1,
      OrganizationId: 1,
      name: 'gitpay',
      ProgrammingLanguages: [
        { id: 'ts', name: 'TypeScript' },
        { id: 'react', name: 'React' }
      ]
    },
    createdAt: '2024-11-10T10:00:00Z'
  },
  {
    id: 2202,
    title: 'Stripe webhook retries flaky in EU',
    status: 'open',
    value: 150,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/2202',
    Labels: [{ id: 'bug', name: 'bug' }],
    Project: {
      id: 1,
      OrganizationId: 1,
      name: 'gitpay',
      ProgrammingLanguages: [{ id: 'ts', name: 'TypeScript' }]
    },
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: 2203,
    title: 'i18n: missing keys on Countries',
    status: 'open',
    value: 80,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/2203',
    Labels: [{ id: 'good-first-issue', name: 'good first issue' }],
    Project: {
      id: 1,
      OrganizationId: 1,
      name: 'gitpay',
      ProgrammingLanguages: [{ id: 'mdx', name: 'MDX' }]
    },
    createdAt: '2024-12-10T10:00:00Z'
  }
]

const baseArgs = {
  profile: baseProfile,
  projects: { data: sampleProjects, completed: true },
  openBounties: { data: sampleOpenBounties, completed: true },
  onViewBounty: action('onViewBounty'),
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

export const EmptyState: Story = {
  args: {
    ...baseArgs,
    projects: { data: [], completed: true },
    openBounties: { data: [], completed: true }
  }
}

export const Loading: Story = {
  args: {
    ...baseArgs,
    projects: { data: [], completed: false },
    openBounties: { data: [], completed: false }
  }
}
