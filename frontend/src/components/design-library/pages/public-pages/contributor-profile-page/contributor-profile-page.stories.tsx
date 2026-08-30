import type { Meta, StoryObj } from '@storybook/react'
import ContributorProfilePage from './contributor-profile-page'

const meta: Meta<typeof ContributorProfilePage> = {
  title: 'Design Library/Pages/Public Pages/ContributorProfilePage',
  component: ContributorProfilePage,
  args: {
    profile: {
      id: 1,
      name: 'Alexandre Magno',
      username: 'alexandremagno',
      picture_url: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
      profile_url: 'https://github.com/alexandremagno',
      website: 'https://blog.alexandremagno.net/en',
      openForJobs: true,
      skills: 'TypeScript, JavaScript, React, Node.js, PostgreSQL'
    },
    stats: {
      issuesSolvedCount: 127,
      issuesSponsoredCount: 12,
      totalEarned: 6840,
      joinedAt: '2019-03-01T00:00:00.000Z'
    },
    paymentLinks: [
      {
        id: 1,
        title: 'Hire me · 1 hour pair session',
        currency: 'usd',
        amount: 90,
        payment_url: 'https://gitpay.me/p/alexandremagno/pair-1h',
        paidCount: 41
      },
      {
        id: 2,
        title: 'Quick bug fix · TypeScript',
        currency: 'usd',
        amount: 80,
        payment_url: 'https://gitpay.me/p/alexandremagno/quick-fix-ts',
        paidCount: 28
      }
    ],
    issues: { data: [], completed: true, totalCount: 0 },
    onTabChange: () => {}
  },
  parameters: { layout: 'fullscreen' }
}
export default meta

type Story = StoryObj<typeof ContributorProfilePage>

export const Default: Story = {}

export const NoPaymentLinks: Story = {
  args: { paymentLinks: [] }
}
