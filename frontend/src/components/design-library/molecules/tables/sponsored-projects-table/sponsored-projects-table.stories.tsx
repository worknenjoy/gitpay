import type { Meta, StoryObj } from '@storybook/react'
import SponsoredProjectsTable from './sponsored-projects-table'

const meta: Meta<typeof SponsoredProjectsTable> = {
  title: 'Design Library/Molecules/Tables/SponsoredProjectsTable',
  component: SponsoredProjectsTable,
  args: {
    rows: [
      {
        id: 1,
        project: 'gitpay',
        amount: 500,
        bountiesCount: 3,
        lastFundedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
      },
      {
        id: 2,
        project: 'issue-bounty',
        amount: 400,
        bountiesCount: 1,
        lastFundedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
      }
    ]
  }
}
export default meta

type Story = StoryObj<typeof SponsoredProjectsTable>

export const Default: Story = {}

export const Empty: Story = {
  args: { rows: [] }
}
