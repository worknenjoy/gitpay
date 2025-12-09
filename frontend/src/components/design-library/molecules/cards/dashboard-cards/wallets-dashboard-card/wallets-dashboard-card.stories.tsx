import type { Meta, StoryObj } from '@storybook/react'
import WalletsDashboardCard from './wallets-dashboard-card'

const meta: Meta<typeof WalletsDashboardCard> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/WalletsDashboardCard',
  component: WalletsDashboardCard
}

export default meta
type Story = StoryObj<typeof WalletsDashboardCard>

export const Default: Story = {
  args: {
    wallets: {
      data: [{ name: 'Main Wallet' }, { name: 'Savings Wallet' }],
      balance: 1500.75
    }
  }
}
