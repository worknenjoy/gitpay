import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import MergeTypeIcon from '@mui/icons-material/MergeType'
import LinkIcon from '@mui/icons-material/Link'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import ContributorDashboard from '../../../../pages/private-pages/dashboard-pages/contributor-dashboard/contributor-dashboard'
import ImportPullRequest, { ImportPullRequestProps } from './import-pull-request'

// Sample data mirrors contributor-dashboard.stories.tsx's Default story, kept local so
// this page-level story doesn't reach into another component's story module.
const dashboardArgs = {
  user: { completed: true, data: { id: '1', name: 'John Doe' } },
  stats: [
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: 'Total earned',
      currency: '$',
      value: '4,293.20',
      note: 'for issues solved'
    },
    {
      icon: <MergeTypeIcon fontSize="small" />,
      label: 'Issues merged',
      value: '15',
      note: 'ready to payout'
    },
    { icon: <LinkIcon fontSize="small" />, label: 'Payment links', value: '3', note: '2 Active' },
    {
      icon: <AccessTimeIcon fontSize="small" />,
      label: 'Awaiting payout',
      currency: '$',
      value: '64.81',
      note: 'automatic payouts enabled'
    }
  ],
  workItems: [
    {
      meta: ['worknenjoy/gitpay', '#1284', 'assigned 4 days ago'],
      title: 'Payment request expiry is ignored when the link is reopened',
      chip: { label: 'Open', tone: 'success' as const },
      currency: '$',
      amount: '180.00'
    },
    {
      meta: ['worknenjoy/gitpay', '#1279', 'assigned 9 days ago'],
      title: 'Add Whop payout provider to the payout settings screen',
      chip: { label: 'Open', tone: 'success' as const },
      currency: '$',
      amount: '240.00'
    }
  ],
  solutions: [
    {
      meta: ['worknenjoy/gitpay', '#1271', 'merged 6 Sep'],
      title: 'Fix wallet balance rounding on the dashboard cards',
      chip: { label: 'Merged', tone: 'success' as const },
      currency: '$',
      amount: '120.00',
      when: 'Paid'
    }
  ],
  payouts: [
    {
      meta: ['PO-2291', 'USD'],
      title: 'Bank account ·· 4512',
      chip: { label: 'Paid', tone: 'success' as const },
      currency: '$',
      amount: '215.00',
      when: '6 Sep'
    }
  ],
  checklistProgress: { completed: 3, total: 4 },
  checklistItems: [
    { label: 'Account created', state: 'checked' as const },
    { label: 'GitHub account connected', state: 'checked' as const },
    { label: 'First issue claimed', state: 'checked' as const },
    { label: 'Payout account connected', state: 'empty' as const }
  ],
  claims: [
    {
      items: [
        { label: 'For bounties', value: '$32.42' },
        { label: 'Total', value: '$64.81', variant: 'emphasis' as const }
      ]
    }
  ],
  payoutsSummary: [
    {
      items: [
        { label: 'Paid out', value: '$51.94' },
        { label: 'Total', value: '$1.83', variant: 'emphasis' as const }
      ]
    }
  ],
  onExploreIssuesClick: () => {},
  onConnectPayoutClick: () => {},
  onViewWorkItemsClick: () => {},
  onViewSolutionsClick: () => {},
  onViewPayoutsClick: () => {},
  onViewClaimsClick: () => {},
  onViewPayoutsSummaryClick: () => {}
}

const meta: Meta<typeof ImportPullRequest> = {
  title: 'Design Library/Organisms/Forms/ImportPullRequest',
  component: ImportPullRequest,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof ImportPullRequest>

const baseArgs: Partial<ImportPullRequestProps> = {
  viewerUsername: 'alexanmtz',
  resolvePullRequest: async (url) =>
    url.includes('1301')
      ? {
          repo: 'worknenjoy/gitpay',
          number: 1301,
          title: 'Add Whop payout provider to the payout settings screen',
          state: 'merged'
        }
      : undefined,
  buildShareUrl: (paymentUrl) => paymentUrl,
  buildComment: ({ mode, price, shareUrl }) => {
    const intro =
      mode === 'fixed'
        ? `If you'd like to support the work on this pull request, I'm asking **${price} USD** — totally optional.`
        : "If you'd like to support the work on this pull request, any amount is welcome — totally optional."
    return `${intro}\n\n**[Pay here](${shareUrl})**\n\n_[Gitpay](https://gitpay.me) lets you send payments directly to contributors for work delivered on GitHub._`
  },
  onSubmit: async () => ({ id: 1, paymentUrl: 'https://gitpay.me/pr/1301' }),
  onPost: async () => {}
}

export const Default: Story = {
  args: {
    ...baseArgs,
    onImportIssueClick: () => {}
  } as ImportPullRequestProps
}

export const OnDashboardPage: Story = {
  decorators: [withProfileTemplate],
  args: {
    user: {
      logged: true,
      completed: true,
      data: { id: 1, username: 'alexanmtz', Types: [{ id: 1, name: 'contributor' }] }
    }
  },
  render: () => (
    <>
      <ContributorDashboard {...dashboardArgs} />
      <ImportPullRequest {...(baseArgs as ImportPullRequestProps)} onImportIssueClick={() => {}} />
    </>
  )
}
