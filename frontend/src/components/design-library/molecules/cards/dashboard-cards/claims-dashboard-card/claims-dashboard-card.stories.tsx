import type { Meta, StoryObj } from '@storybook/react'
import ClaimsDashboardCard from './claims-dashboard-card'

const meta: Meta<typeof ClaimsDashboardCard> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/ClaimsDashboardCard',
  component: ClaimsDashboardCard
}

export default meta
type Story = StoryObj<typeof ClaimsDashboardCard>

export const Default: Story = {
  args: {
    claims: {
      total: 8,
      amount: 1200
    }
  }
}
