import type { Meta, StoryObj } from '@storybook/react'
import BankAccountDashboardCard from './bank-account-dashboard-card'

const meta: Meta<typeof BankAccountDashboardCard> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/BankAccountDashboardCard',
  component: BankAccountDashboardCard
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
