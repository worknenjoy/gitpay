import type { Meta, StoryObj } from '@storybook/react'
import DashboardCardList from './dashboard-card-list'

const meta: Meta<typeof DashboardCardList> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/DashboardCardList',
  component: DashboardCardList,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof DashboardCardList>

export const Default: Story = {
  args: {
    dashboard: {
      completed: true,
      data: {
        issues: {
          total: 42,
          open: 27,
          closed: 15
        },
        payments: {
          amount: 5000,
          total: 1000,
          pending: 200,
          succeeded: 800,
          failed: 50
        },
        wallets: {
          data: [{ name: 'Main Wallet' }, { name: 'Savings Wallet' }],
          balance: 1500.75
        },
        paymentRequests: {
          total: 15,
          amount: 3000,
          payments: 10
        },
        claims: {
          total: 8,
          amount: 1200
        },
        payouts: {
          usd: {
            currency: 'usd',
            amount: 4500,
            total: 20,
            pending: 5,
            completed: 15,
            in_transit: 5
          }
        }
      }
    },
    user: {
      completed: true,
      data: {
        username: 'johndoe',
        email: 'johndoe@example.com',
        Types: [
          { id: 1, name: 'contributor', label: 'Contributor' },
          { id: 2, name: 'maintainer', label: 'Maintainer' },
          { id: 3, name: 'funding', label: 'Funding' }
        ]
      }
    }
  }
}

export const LoadingState: Story = {
  args: {
    dashboard: {
      completed: false,
      data: {}
    },
    user: {
      completed: false,
      data: {}
    }
  }
}
