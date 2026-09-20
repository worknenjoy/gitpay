import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { ListCardItem } from 'design-library/molecules/cards/list-card/list-card'
import { ChecklistCardItem } from 'design-library/molecules/cards/checklist-card/checklist-card'
import { StatGroupCardItem } from 'design-library/molecules/cards/stat-card/stat-group-card'
import { formatAmount, mapWalletSection } from './dashboard-shared.mappers'

export { mapWalletSection }

// Order.provider's real values (stripe/paypal/wallet/whop) aren't the literal
// tag shown per row — map them to how the money actually moved.
const PROVIDER_LABEL: Record<string, string> = {
  stripe: 'card',
  paypal: 'paypal',
  wallet: 'wallet',
  whop: 'whop'
}

export const mapFundingPayments = (orders: any[] = []): ListCardItem[] =>
  orders.map((order) => {
    const isPaid = order.status === 'succeeded'
    return {
      id: order.id,
      meta: [PROVIDER_LABEL[order.provider] ?? order.provider, order.Task?.Project?.repo],
      title: order.Task?.title,
      chip: isPaid
        ? {
            label: <FormattedMessage id="dashboard.funding.when.paid" defaultMessage="Paid" />,
            tone: 'success' as const
          }
        : {
            label: (
              <FormattedMessage id="dashboard.funding.status.pending" defaultMessage="Pending" />
            ),
            tone: 'warning' as const
          },
      currency: '$',
      amount: formatAmount(order.amount),
      when: moment(order.createdAt).format('D MMM')
    }
  })

export const mapFundingStats = (dashboardData: any = {}): StatGroupCardItem[] => [
  {
    icon: <AttachMoneyIcon fontSize="small" />,
    label: <FormattedMessage id="dashboard.funding.stats.funded.label" defaultMessage="Funded" />,
    currency: '$',
    value: formatAmount(dashboardData.payments?.amount),
    note: (
      <FormattedMessage
        id="dashboard.funding.stats.funded.note"
        defaultMessage="across {count} projects"
        values={{ count: dashboardData.payments?.distinctProjects ?? 0 }}
      />
    )
  },
  {
    icon: <TrendingUpIcon fontSize="small" />,
    label: (
      <FormattedMessage id="dashboard.funding.stats.payments.label" defaultMessage="Payments" />
    ),
    value: String(dashboardData.payments?.succeeded ?? 0),
    note: (
      <FormattedMessage
        id="dashboard.funding.stats.payments.note"
        defaultMessage="{amount} processed"
        values={{ amount: `$${formatAmount(dashboardData.payments?.amount)}` }}
      />
    )
  },
  {
    icon: <FavoriteIcon fontSize="small" />,
    label: (
      <FormattedMessage
        id="dashboard.funding.stats.projectsSponsored.label"
        defaultMessage="Projects sponsored"
      />
    ),
    value: String(dashboardData.payments?.distinctProjects ?? 0),
    note: (
      <FormattedMessage
        id="dashboard.funding.stats.projectsSponsored.note"
        defaultMessage="{count} payments"
        values={{ count: dashboardData.payments?.total ?? 0 }}
      />
    )
  },
  {
    icon: <AccountBalanceWalletIcon fontSize="small" />,
    label: (
      <FormattedMessage
        id="dashboard.funding.stats.walletBalance.label"
        defaultMessage="Wallet balance"
      />
    ),
    currency: '$',
    value: formatAmount(dashboardData.wallets?.balance),
    note: (
      <FormattedMessage
        id="dashboard.funding.stats.walletBalance.note"
        defaultMessage="{count} wallet created"
        values={{ count: dashboardData.wallets?.total ?? 0 }}
      />
    )
  }
]

export const mapFundingChecklist = ({ user, dashboardData }: { user: any; dashboardData: any }) => {
  const items: ChecklistCardItem[] = [
    {
      label: (
        <FormattedMessage
          id="dashboard.funding.checklist.accountCreated"
          defaultMessage="Account created"
        />
      ),
      state: user?.id ? 'checked' : 'empty'
    },
    {
      label: (
        <FormattedMessage
          id="dashboard.funding.checklist.firstProjectSponsored"
          defaultMessage="First project sponsored"
        />
      ),
      state: (dashboardData?.payments?.total ?? 0) > 0 ? 'checked' : 'empty'
    },
    {
      label: (
        <FormattedMessage
          id="dashboard.funding.checklist.walletToppedUp"
          defaultMessage="Wallet topped up"
        />
      ),
      state: (dashboardData?.wallets?.balance ?? 0) > 0 ? 'checked' : 'empty'
    }
  ]

  return {
    checklistProgress: {
      completed: items.filter((item) => item.state === 'checked').length,
      total: items.length
    },
    checklistItems: items
  }
}
