import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import UserProfilePublicPage from './user-profile-public-page'
import { withPublicTemplate } from '../../../../../../.storybook/decorators/withPublicTemplate'

const meta = {
  title: 'Design Library/Pages/Public/UserProfile',
  component: UserProfilePublicPage,
  decorators: [withPublicTemplate]
} satisfies Meta<typeof UserProfilePublicPage>

export default meta
type Story = StoryObj<typeof UserProfilePublicPage>

export const Default: Story = {
  args: {
    profile: {
      picture_url: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
      username: 'octocat',
      name: 'The Octocat',
      profile_url: 'https://github.com/octocat'
    },
    getUserTypes: () => Promise.resolve(['type1', 'type2']),
    tasks: {
      completed: true,
      data: [
        {
          id: 1,
          title: 'Issue 1',
          status: 'open',
          value: 100,
          created_at: '2024-01-01'
        },
        {
          id: 2,
          title: 'Issue 2',
          status: 'closed',
          value: 200,
          created_at: '2024-02-01'
        }
      ]
    },
    listTasks: () => {
      return Promise.resolve()
    }
  }
}

export const Contributor: Story = {
  args: {
    profileTypes: ['contributor'],
    user: {
      completed: true,
      data: {
        username: 'alexandremagno',
        name: 'Alexandre Magno',
        website: 'https://blog.alexandremagno.net/en',
        country: 'BR',
        profile_url: 'https://github.com/alexandremagno',
        picture_url: '',
        verified: true,
        role: { name: 'contributor', tone: 'orange' },
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
    },
    tasks: {
      completed: true,
      data: [
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
        }
      ]
    },
    pullRequests: {
      completed: true,
      data: [
        {
          id: 1,
          pullRequestURL: 'https://github.com/worknenjoy/gitpay/pull/1101',
          isPRMerged: true,
          isIssueClosed: true,
          createdAt: '2024-11-02T10:00:00Z',
          Task: { id: 1101, title: 'When accept the terms in account settings, redirect fails' }
        }
      ]
    },
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
}
