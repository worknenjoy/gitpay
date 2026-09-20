import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import LinkIcon from '@mui/icons-material/Link'
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

export const mapPaymentLinks = (paymentRequests: any[] = []): ListCardItem[] =>
  paymentRequests.map((request) => {
    const paidCount = request.PaymentRequestPayments?.length || 0
    return {
      id: request.id,
      meta: [request.payment_url, request.custom_amount ? 'flexible' : 'fixed'],
      title: request.title,
      chip: request.active
        ? {
            label: (
              <FormattedMessage id="dashboard.provider.status.active" defaultMessage="Active" />
            ),
            tone: 'success' as const
          }
        : {
            label: (
              <FormattedMessage id="dashboard.provider.status.archived" defaultMessage="Archived" />
            ),
            tone: 'neutral' as const
          },
      currency: '$',
      amount: formatAmount(request.amount),
      when:
        paidCount > 0 ? (
          <FormattedMessage
            id="dashboard.provider.paymentLinks.paidCount"
            defaultMessage="{count} paid"
            values={{ count: paidCount }}
          />
        ) : (
          '—'
        )
    }
  })

export const mapPaymentsReceived = (payments: any[] = []): ListCardItem[] =>
  payments.map((payment) => {
    const chip =
      payment.status === 'succeeded' || payment.status === 'paid'
        ? {
            label: <FormattedMessage id="dashboard.provider.when.paid" defaultMessage="Paid" />,
            tone: 'success' as const
          }
        : payment.status === 'refunded'
          ? {
              label: (
                <FormattedMessage
                  id="dashboard.provider.status.refunded"
                  defaultMessage="Refunded"
                />
              ),
              tone: 'neutral' as const
            }
          : payment.status === 'failed'
            ? {
                label: (
                  <FormattedMessage id="dashboard.provider.status.failed" defaultMessage="Failed" />
                ),
                tone: 'error' as const
              }
            : {
                label: (
                  <FormattedMessage
                    id="dashboard.provider.status.pending"
                    defaultMessage="Pending"
                  />
                ),
                tone: 'warning' as const
              }

    return {
      id: payment.id,
      meta: [
        <FormattedMessage
          key="ref"
          id="dashboard.provider.paymentsReceived.reference"
          defaultMessage="PR #{id}"
          values={{ id: payment.paymentRequestId }}
        />,
        payment.source
      ],
      title: payment.PaymentRequest?.title,
      chip,
      currency: '$',
      amount: formatAmount(payment.amount),
      when: moment(payment.createdAt).format('D MMM')
    }
  })

export const mapProviderStats = (dashboardData: any = {}): StatGroupCardItem[] => {
  const paymentRequests = dashboardData.paymentRequests ?? {}
  const recentPayments = paymentRequests.recentPayments ?? { count: 0, amount: 0 }

  return [
    {
      icon: <AttachMoneyIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.provider.stats.totalRevenue.label"
          defaultMessage="Total revenue"
        />
      ),
      currency: '$',
      value: formatAmount(dashboardData.claims?.paymentRequests),
      note: (
        <FormattedMessage
          id="dashboard.provider.stats.totalRevenue.note"
          defaultMessage="across {count} payments"
          values={{ count: paymentRequests.payments ?? 0 }}
        />
      )
    },
    {
      icon: <TrendingUpIcon fontSize="small" />,
      label: (
        <FormattedMessage id="dashboard.provider.stats.payments.label" defaultMessage="Payments" />
      ),
      currency: '$',
      value: formatAmount(recentPayments.amount),
      note: (
        <FormattedMessage
          id="dashboard.provider.stats.payments.note"
          defaultMessage="{count} in the last 30 days"
          values={{ count: recentPayments.count }}
        />
      )
    },
    {
      icon: <PeopleIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.provider.stats.customers.label"
          defaultMessage="Customers"
        />
      ),
      value: String(paymentRequests.customers ?? 0),
      note: (
        <FormattedMessage
          id="dashboard.provider.stats.customers.note"
          defaultMessage="{percent}% of links converted"
          values={{ percent: paymentRequests.convertedPercent ?? 0 }}
        />
      )
    },
    {
      icon: <LinkIcon fontSize="small" />,
      label: (
        <FormattedMessage
          id="dashboard.provider.stats.paymentLinks.label"
          defaultMessage="Payment links"
        />
      ),
      value: String(paymentRequests.total ?? 0),
      note: (
        <FormattedMessage
          id="dashboard.provider.stats.paymentLinks.note"
          defaultMessage="{count} active"
          values={{ count: paymentRequests.active ?? 0 }}
        />
      )
    }
  ]
}

export const mapProviderChecklist = ({
  user,
  account,
  hasCreatedLink,
  hasPaidLink,
  onCreatePaymentLinkClick,
  onConnectPayoutClick
}: {
  user: any
  account: any
  hasCreatedLink: boolean
  hasPaidLink: boolean
  /** Only pending steps that have somewhere to send the user get a link —
   * 'Account created' and 'First payment link paid' stay unlinked, matching
   * the same rule already implemented for the Contributor checklist. */
  onCreatePaymentLinkClick?: () => void
  onConnectPayoutClick?: () => void
}) => {
  const payoutConnected = validAccount(user, account)

  const items: ChecklistCardItem[] = [
    {
      label: (
        <FormattedMessage
          id="dashboard.provider.checklist.accountCreated"
          defaultMessage="Account created"
        />
      ),
      state: user?.id ? 'checked' : 'empty'
    },
    {
      label: (
        <FormattedMessage
          id="dashboard.provider.checklist.firstLinkCreated"
          defaultMessage="First payment link created"
        />
      ),
      state: hasCreatedLink ? 'checked' : 'empty',
      onClick: hasCreatedLink ? undefined : onCreatePaymentLinkClick
    },
    {
      label: (
        <FormattedMessage
          id="dashboard.provider.checklist.payoutConnected"
          defaultMessage="Payout account connected"
        />
      ),
      state: payoutConnected ? 'checked' : 'empty',
      onClick: payoutConnected ? undefined : onConnectPayoutClick
    },
    {
      label: (
        <FormattedMessage
          id="dashboard.provider.checklist.firstLinkPaid"
          defaultMessage="First payment link paid"
        />
      ),
      state: hasPaidLink ? 'checked' : 'empty'
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
