import type { Meta, StoryObj } from '@storybook/react'
import MaintainerProfilePage from './maintainer-profile-page'

const meta: Meta<typeof MaintainerProfilePage> = {
  title: 'Design Library/Pages/Public Pages/MaintainerProfilePage',
  component: MaintainerProfilePage,
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
      projectsMaintainedCount: 4,
      totalFundedForProjects: 17020,
      openBountiesCount: 14,
      contributorsCount: 215,
      maintainingSince: '2019-01-01T00:00:00.000Z'
    },
    projects: [
      {
        id: 1,
        name: 'gitpay',
        repo: 'gitpay',
        org: 'worknenjoy',
        organizationId: 1,
        description: 'Payment platform for open-source work delivered.',
        openBountyCount: 8,
        totalPaid: 12480,
        issuesCount: 142
      },
      {
        id: 2,
        name: 'issue-bounty',
        repo: 'issue-bounty',
        org: 'worknenjoy',
        organizationId: 1,
        description: 'GitHub Action that posts bounties to PR threads automatically.',
        openBountyCount: 3,
        totalPaid: 2240,
        issuesCount: 38
      }
    ],
    bounties: { data: [], completed: true, totalCount: 0 }
  },
  parameters: { layout: 'fullscreen' }
}
export default meta

type Story = StoryObj<typeof MaintainerProfilePage>

export const Default: Story = {}
