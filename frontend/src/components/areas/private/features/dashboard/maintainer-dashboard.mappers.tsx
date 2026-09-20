import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AssignmentIcon from '@mui/icons-material/Assignment'
import GroupsIcon from '@mui/icons-material/Groups'
import { ListCardItem } from 'design-library/molecules/cards/list-card/list-card'
import { ChecklistCardItem } from 'design-library/molecules/cards/checklist-card/checklist-card'
import { StatGroupCardItem } from 'design-library/molecules/cards/stat-card/stat-group-card'
import { formatAmount, mapWalletSection } from './dashboard-shared.mappers'

export { mapWalletSection }

const issueNumberFromUrl = (url?: string | null) => {
  if (!url) return null
  const number = url.split('/').pop()
  return number ? `#${number}` : null
}

const findAssignedUser = (task: any) =>
  task.Assigns?.find((assign: any) => assign.id === task.assigned)

export const mapOpenIssues = (tasks: any[] = []): ListCardItem[] =>
  tasks
    .filter((task) => task.status === 'open')
    .map((task) => {
      const assign = findAssignedUser(task)
      return {
        id: task.id,
        meta: [
          task.Project?.repo,
          issueNumberFromUrl(task.url),
          assign?.User?.username ? (
            <FormattedMessage
              id="dashboard.maintainer.openIssues.assignedMeta"
              defaultMessage="{username} assigned"
              values={{ username: assign.User.username }}
            />
          ) : null
        ],
        title: task.title,
        chip: {
          label: <FormattedMessage id="dashboard.maintainer.status.open" defaultMessage="Open" />,
          tone: 'success' as const
        },
        currency: '$',
        amount: formatAmount(task.value)
      }
    })

export const mapClosedIssues = (tasks: any[] = []): ListCardItem[] =>
  tasks
    .filter((task) => task.status === 'closed')
    .map((task) => {
      const assign = findAssignedUser(task)
      return {
        id: task.id,
        meta: [task.Project?.repo, issueNumberFromUrl(task.url)],
        title: task.title,
        chip: {
          label: (
            <FormattedMessage id="dashboard.maintainer.status.closed" defaultMessage="Closed" />
          ),
          tone: 'neutral' as const
        },
        currency: '$',
        amount: formatAmount(task.value),
        when: assign?.User?.username
      }
    })

export const mapMaintainerPayments = (transfers: any[] = []): ListCardItem[] =>
  transfers.map((transfer) => {
    const isPaid = transfer.status === 'in_transit'
    const issueNumber = transfer.Task?.url ? transfer.Task.url.split('/').pop() : null

    return {
      id: transfer.id,
      meta: [
        transfer.transfer_method,
        issueNumber ? (
          <FormattedMessage
            id="dashboard.maintainer.payments.issueMeta"
            defaultMessage="issue #{number}"
            values={{ number: issueNumber }}
          />
        ) : null
      ],
      title: (
        <FormattedMessage
          id="dashboard.maintainer.payments.rowTitle"
          defaultMessage="Bounty released to {username}"
          values={{ username: transfer.destination?.username }}
        />
      ),
      chip: isPaid
        ? {
            label: <FormattedMessage id="dashboard.maintainer.when.paid" defaultMessage="Paid" />,
            tone: 'success' as const
          }
        : {
            label: (
              <FormattedMessage id="dashboard.maintainer.status.pending" defaultMessage="Pending" />
            ),
            tone: 'warning' as const
          },
      currency: '$',
      amount: formatAmount(transfer.value),
      when: moment(transfer.createdAt).format('D MMM')
    }
  })

export const mapMaintainerStats = (
  dashboardData: any = {},
  projects: any[] = []
): StatGroupCardItem[] => {
  const organizations = new Set(projects.map((project) => project.Organization?.id).filter(Boolean))
    .size

  return [
    {
      icon: <AttachMoneyIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.maintainer.stats.paidToContributors.label"
          defaultMessage="Paid to contributors"
        />
      ),
      currency: '$',
      value: formatAmount(dashboardData.payments?.amount),
      note: (
        <FormattedMessage
          id="dashboard.maintainer.stats.paidToContributors.note"
          defaultMessage="across {count} payments"
          values={{ count: dashboardData.payments?.succeeded ?? 0 }}
        />
      )
    },
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.maintainer.stats.walletBalance.label"
          defaultMessage="Wallet balance"
        />
      ),
      currency: '$',
      value: formatAmount(dashboardData.wallets?.balance),
      note: (
        <FormattedMessage
          id="dashboard.maintainer.stats.walletBalance.note"
          defaultMessage="{count} wallet created"
          values={{ count: dashboardData.wallets?.total ?? 0 }}
        />
      )
    },
    {
      icon: <AssignmentIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.maintainer.stats.openBounties.label"
          defaultMessage="Open bounties"
        />
      ),
      value: String(dashboardData.issues?.open ?? 0),
      note: (
        <FormattedMessage
          id="dashboard.maintainer.stats.openBounties.note"
          defaultMessage="{amount} committed"
          values={{ amount: `$${formatAmount(dashboardData.issues?.openValue)}` }}
        />
      )
    },
    {
      icon: <GroupsIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.maintainer.stats.projects.label"
          defaultMessage="Projects"
        />
      ),
      value: String(projects.length),
      note: (
        <FormattedMessage
          id="dashboard.maintainer.stats.projects.note"
          defaultMessage="in {count} organizations"
          values={{ count: organizations }}
        />
      )
    }
  ]
}

export const mapMaintainerChecklist = ({
  user,
  dashboardData
}: {
  user: any
  dashboardData: any
}) => {
  const items: ChecklistCardItem[] = [
    {
      label: (
        <FormattedMessage
          id="dashboard.maintainer.checklist.accountCreated"
          defaultMessage="Account created"
        />
      ),
      state: user?.id ? 'checked' : 'empty'
    },
    {
      label: (
        <FormattedMessage
          id="dashboard.maintainer.checklist.firstIssueFunded"
          defaultMessage="First issue funded"
        />
      ),
      state: (dashboardData?.issues?.total ?? 0) > 0 ? 'checked' : 'empty'
    },
    {
      label: (
        <FormattedMessage
          id="dashboard.maintainer.checklist.firstIssuePaid"
          defaultMessage="First issue paid"
        />
      ),
      state: (dashboardData?.payments?.succeeded ?? 0) > 0 ? 'checked' : 'empty'
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
