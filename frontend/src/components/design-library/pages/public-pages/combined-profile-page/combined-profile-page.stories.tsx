import type { Meta, StoryObj } from '@storybook/react'
import CombinedProfilePage from './combined-profile-page'

const meta: Meta<typeof CombinedProfilePage> = {
  title: 'Design Library/Pages/Public Pages/CombinedProfilePage',
  component: CombinedProfilePage,
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
      contributor: { issuesSolvedCount: 127, issuesSponsoredCount: 12, totalEarned: 6840 },
      maintainer: {
        projectsMaintainedCount: 4,
        totalFundedForProjects: 17020,
        openBountiesCount: 14,
        contributorsCount: 215
      },
      provider: { jobsDeliveredCount: 147, totalReceived: 38420 },
      funding: { projectsSponsoredCount: 9, totalFunded: 24800, bountiesPlacedCount: 42 }
    },
    projects: [
      {
        id: 1,
        name: 'gitpay',
        repo: 'gitpay',
        org: 'worknenjoy',
        description: 'Payment platform for OSS work delivered.',
        openBountyCount: 8,
        totalPaid: 12480,
        issuesCount: 142
      }
    ],
    paymentLinks: [
      {
        id: 1,
        title: 'Code review · 1 hour deep dive',
        currency: 'usd',
        amount: 120,
        payment_url: 'https://gitpay.me/p/alexandremagno/code-review-1h',
        paidCount: 38
      }
    ],
    issues: { data: [], completed: true, totalCount: 0 },
    activeRole: 'overview',
    onRoleChange: () => {}
  },
  parameters: { layout: 'fullscreen' }
}
export default meta

type Story = StoryObj<typeof CombinedProfilePage>

export const Overview: Story = {}

export const Funding: Story = {
  args: { activeRole: 'funding' }
}
