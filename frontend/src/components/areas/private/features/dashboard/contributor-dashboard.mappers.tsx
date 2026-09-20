import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import MergeTypeIcon from '@mui/icons-material/MergeType'
import LinkIcon from '@mui/icons-material/Link'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import {
  currencyCodeToSymbol,
  convertStripeAmountByCurrency
} from 'design-library/molecules/cards/balance-card/balance-card'
import { ListCardItem } from 'design-library/molecules/cards/list-card/list-card'
import { ChecklistCardItem } from 'design-library/molecules/cards/checklist-card/checklist-card'
import { StatGroupCardItem } from 'design-library/molecules/cards/stat-card/stat-group-card'
import { validAccount } from '../../../../../utils/valid-account'
import {
  formatAmount,
  mapClaimsSections,
  mapPayoutsSummarySections
} from './dashboard-shared.mappers'

export { mapClaimsSections, mapPayoutsSummarySections }

const issueNumberFromUrl = (url?: string | null) => {
  if (!url) return null
  const number = url.split('/').pop()
  return number ? `#${number}` : null
}

export const mapWorkItems = (tasks: any[] = []): ListCardItem[] =>
  tasks.map((task) => {
    const assign = task.Assigns?.find((a: any) => a.id === task.assigned)
    return {
      id: task.id,
      meta: [
        task.Project?.repo,
        issueNumberFromUrl(task.url),
        assign ? (
          <FormattedMessage
            id="dashboard.contributor.workItems.assignedMeta"
            defaultMessage="assigned {time}"
            values={{ time: moment(assign.createdAt).fromNow() }}
          />
        ) : null
      ],
      title: task.title,
      chip:
        task.status === 'closed'
          ? {
              label: (
                <FormattedMessage
                  id="dashboard.contributor.status.closed"
                  defaultMessage="Closed"
                />
              ),
              tone: 'error' as const
            }
          : {
              label: (
                <FormattedMessage id="dashboard.contributor.status.open" defaultMessage="Open" />
              ),
              tone: 'success' as const
            },
      currency: '$',
      amount: formatAmount(task.value)
    }
  })

export const mapSolutions = (solutions: any[] = []): ListCardItem[] =>
  solutions.map((solution) => {
    const task = solution.Task || {}
    const orders = task.Orders || []
    const paidOrder = orders.find((order: any) => order.status === 'succeeded')
    const time = moment(solution.createdAt).fromNow()
    const chip = solution.isPRMerged
      ? {
          label: (
            <FormattedMessage id="dashboard.contributor.status.merged" defaultMessage="Merged" />
          ),
          tone: 'success' as const
        }
      : solution.isIssueClosed
        ? {
            label: (
              <FormattedMessage id="dashboard.contributor.status.closed" defaultMessage="Closed" />
            ),
            tone: 'neutral' as const
          }
        : {
            label: (
              <FormattedMessage id="dashboard.contributor.status.open" defaultMessage="Open" />
            ),
            tone: 'info' as const
          }

    return {
      id: solution.id,
      meta: [
        task.Project?.repo,
        issueNumberFromUrl(task.url),
        solution.isPRMerged ? (
          <FormattedMessage
            id="dashboard.contributor.solutions.mergedMeta"
            defaultMessage="merged {time}"
            values={{ time }}
          />
        ) : (
          <FormattedMessage
            id="dashboard.contributor.solutions.sentMeta"
            defaultMessage="sent {time}"
            values={{ time }}
          />
        )
      ],
      title: task.title,
      chip,
      currency: '$',
      amount: formatAmount(task.value),
      when: paidOrder ? (
        <FormattedMessage id="dashboard.contributor.when.paid" defaultMessage="Paid" />
      ) : orders.length > 0 ? (
        <FormattedMessage id="dashboard.contributor.when.inTransit" defaultMessage="In transit" />
      ) : undefined
    }
  })

export const mapPayoutRows = (payouts: any[] = []): ListCardItem[] =>
  payouts.map((payout) => {
    const currency = (payout.currency || 'usd').toLowerCase()
    const chip =
      payout.status === 'paid'
        ? {
            label: <FormattedMessage id="dashboard.contributor.when.paid" defaultMessage="Paid" />,
            tone: 'success' as const
          }
        : payout.status === 'in_transit'
          ? {
              label: (
                <FormattedMessage
                  id="dashboard.contributor.when.inTransit"
                  defaultMessage="In transit"
                />
              ),
              tone: 'warning' as const
            }
          : payout.status === 'pending'
            ? {
                label: (
                  <FormattedMessage
                    id="dashboard.contributor.status.pending"
                    defaultMessage="Pending"
                  />
                ),
                tone: 'neutral' as const
              }
            : { label: payout.status, tone: 'neutral' as const }

    return {
      id: payout.id,
      meta: [`PO-${payout.id}`, currency.toUpperCase()],
      title: payout.reference_number ? (
        <FormattedMessage
          id="dashboard.contributor.payouts.rowTitleWithReference"
          defaultMessage="Payout · {reference}"
          values={{ reference: payout.reference_number }}
        />
      ) : (
        <FormattedMessage id="dashboard.contributor.payouts.rowTitle" defaultMessage="Payout" />
      ),
      chip,
      currency: currencyCodeToSymbol(currency),
      amount: convertStripeAmountByCurrency(payout.amount, currency),
      when: moment(payout.createdAt).format('D MMM')
    }
  })

export const mapStats = (dashboardData: any = {}, solutions: any[] = []): StatGroupCardItem[] => {
  const mergedCount = solutions.filter((solution) => solution.isPRMerged).length

  return [
    {
      icon: <AccountBalanceWalletIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.contributor.stats.totalEarned.label"
          defaultMessage="Total earned"
        />
      ),
      currency: '$',
      value: formatAmount(dashboardData.claims?.amount),
      note: (
        <FormattedMessage
          id="dashboard.contributor.stats.totalEarned.note"
          defaultMessage="for issues solved"
        />
      )
    },
    {
      icon: <MergeTypeIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.contributor.stats.issuesMerged.label"
          defaultMessage="Issues merged"
        />
      ),
      value: String(mergedCount),
      note: (
        <FormattedMessage
          id="dashboard.contributor.stats.issuesMerged.note"
          defaultMessage="ready to payout"
        />
      )
    },
    {
      icon: <LinkIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.contributor.stats.paymentLinks.label"
          defaultMessage="Payment links"
        />
      ),
      value: String(dashboardData.paymentRequests?.total ?? 0),
      note: (
        <FormattedMessage
          id="dashboard.contributor.stats.paymentLinks.note"
          defaultMessage="{count} Active"
          values={{ count: dashboardData.paymentRequests?.active ?? 0 }}
        />
      )
    },
    {
      icon: <AccessTimeIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.contributor.stats.awaitingPayout.label"
          defaultMessage="Awaiting payout"
        />
      ),
      currency: '$',
      value: formatAmount(dashboardData.awaitingPayoutAmount),
      note: (
        <FormattedMessage
          id="dashboard.contributor.stats.awaitingPayout.note"
          defaultMessage="automatic payouts enabled"
        />
      )
    }
  ]
}

export const mapChecklist = ({
  user,
  account,
  hasClaimedIssue,
  onConnectGithubClick,
  onClaimIssueClick,
  onConnectPayoutClick
}: {
  user: any
  account: any
  hasClaimedIssue: boolean
  /** Steps below are only ever linked while pending — a finished step has
   * nothing left to complete. 'Account created' is never linked: it's set
   * automatically, there's nowhere to send the user to "do" it. */
  onConnectGithubClick?: () => void
  onClaimIssueClick?: () => void
  onConnectPayoutClick?: () => void
}) => {
  const githubConnected = user?.provider === 'github'
  const payoutConnected = validAccount(user, account)

  const items: ChecklistCardItem[] = [
    {
      label: (
        <FormattedMessage
          id="dashboard.contributor.checklist.accountCreated"
          defaultMessage="Account created"
        />
      ),
      state: user?.id ? 'checked' : 'empty'
    },
    {
      label: (
        <FormattedMessage
          id="dashboard.contributor.checklist.githubConnected"
          defaultMessage="GitHub account connected"
        />
      ),
      state: githubConnected ? 'checked' : 'empty',
      onClick: githubConnected ? undefined : onConnectGithubClick
    },
    {
      label: (
        <FormattedMessage
          id="dashboard.contributor.checklist.firstIssueClaimed"
          defaultMessage="First issue claimed"
        />
      ),
      state: hasClaimedIssue ? 'checked' : 'empty',
      onClick: hasClaimedIssue ? undefined : onClaimIssueClick
    },
    {
      label: (
        <FormattedMessage
          id="dashboard.contributor.checklist.payoutConnected"
          defaultMessage="Payout account connected"
        />
      ),
      state: payoutConnected ? 'checked' : 'empty',
      onClick: payoutConnected ? undefined : onConnectPayoutClick
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
