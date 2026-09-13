import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import FundingProfileVariant from './funding-profile-variant'
import { withPublicTemplate } from '../../../../../../../../.storybook/decorators/withPublicTemplate'

const meta = {
  title: 'Design Library/Pages/Public/UserProfile/Variants/Funding',
  component: FundingProfileVariant,
  decorators: [withPublicTemplate]
} satisfies Meta<typeof FundingProfileVariant>

export default meta
type Story = StoryObj<typeof FundingProfileVariant>

const baseProfile = {
  username: 'alexandremagno',
  name: 'Alexandre Magno',
  website: 'https://blog.alexandremagno.net/en',
  country: 'BR',
  profile_url: 'https://github.com/alexandremagno',
  picture_url: '',
  verified: true,
  role: { name: 'funding', tone: 'pink' as const },
  identity: ['Funding since 2023', '5 bounties funded'],
  stats: ['$1,220 funded']
}

const sampleBounties = [
  {
    id: 3101,
    title: 'Server side rendering for /explore',
    status: 'open',
    value: 200,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/3101',
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
    id: 3102,
    title: 'Stripe webhook retries flaky in EU',
    status: 'open',
    value: 150,
    provider: 'github',
    url: 'https://github.com/gitpay/gitpay/issues/3102',
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
    id: 3103,
    title: 'Type inference on nested routers',
    status: 'closed',
    value: 300,
    provider: 'github',
    url: 'https://github.com/trpc/trpc/issues/3103',
    Labels: [{ id: 'enhancement', name: 'enhancement' }],
    Project: {
      id: 2,
      OrganizationId: 2,
      name: 'trpc',
      ProgrammingLanguages: [{ id: 'ts', name: 'TypeScript' }]
    },
    createdAt: '2024-08-05T10:00:00Z'
  },
  {
    id: 3104,
    title: 'Batch mutation support',
    status: 'closed',
    value: 450,
    provider: 'github',
    url: 'https://github.com/hasura/hasura/issues/3104',
    Labels: [{ id: 'feature', name: 'feature' }],
    Project: {
      id: 3,
      OrganizationId: 3,
      name: 'hasura',
      ProgrammingLanguages: [{ id: 'go', name: 'Go' }]
    },
    createdAt: '2024-07-01T10:00:00Z'
  },
  {
    id: 3105,
    title: 'Async callback docs',
    status: 'closed',
    value: 120,
    provider: 'github',
    url: 'https://github.com/langchain/langchain-py/issues/3105',
    Labels: [{ id: 'docs', name: 'docs' }],
    Project: {
      id: 4,
      OrganizationId: 4,
      name: 'langchain-py',
      ProgrammingLanguages: [{ id: 'mdx', name: 'MDX' }]
    },
    createdAt: '2024-06-01T10:00:00Z'
  }
]

const baseArgs = {
  profile: baseProfile,
  bounties: { data: sampleBounties, completed: true },
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
    bounties: { data: [], completed: true }
  }
}

export const Loading: Story = {
  args: {
    ...baseArgs,
    bounties: { data: [], completed: false }
  }
}
