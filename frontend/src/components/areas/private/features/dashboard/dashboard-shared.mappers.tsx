import React from 'react'
import { FormattedMessage } from 'react-intl'
import { DetailsSection } from 'design-library/molecules/data-display/details-section/details-section'
import { formatCurrency } from '../../../../../utils/format-currency'

/** Shared by every role's dashboard mapper — claims/payouts are money in either from
 * bounty work or from payment requests, and userInfo.ts already merges both sources. */

export const formatAmount = (amount: number) =>
  Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

export const mapClaimsSections = (dashboardData: any = {}): DetailsSection[] => [
  {
    items: [
      {
        label: (
          <FormattedMessage
            id="dashboard.contributor.claims.bounties"
            defaultMessage="For bounties"
          />
        ),
        value: formatCurrency(dashboardData.claims?.bounties ?? 0)
      },
      {
        label: (
          <FormattedMessage
            id="dashboard.contributor.claims.paymentRequests"
            defaultMessage="For payment requests"
          />
        ),
        value: formatCurrency(dashboardData.claims?.paymentRequests ?? 0)
      },
      {
        label: <FormattedMessage id="dashboard.contributor.claims.total" defaultMessage="Total" />,
        value: formatCurrency(dashboardData.claims?.amount ?? 0),
        variant: 'emphasis'
      }
    ]
  }
]

// Maintainer and Funding both show the same "Wallet" summary card shape.
export const mapWalletSection = (dashboardData: any = {}): DetailsSection[] => [
  {
    items: [
      {
        label: <FormattedMessage id="dashboard.wallet.balance" defaultMessage="Balance" />,
        value: formatCurrency(dashboardData.wallets?.balance ?? 0)
      },
      {
        label: (
          <FormattedMessage id="dashboard.wallet.spendBalance" defaultMessage="Spend from wallet" />
        ),
        value: formatCurrency(dashboardData.wallets?.spendBalance ?? 0)
      }
    ]
  }
]

export const mapPayoutsSummarySections = (
  dashboardData: any = {}
): DetailsSection[] | undefined => {
  const payoutsByCurrency = dashboardData.payouts ?? {}
  const currency = Object.keys(payoutsByCurrency)[0]
  if (!currency) return undefined

  const { paidAmount = 0, inTransitAmount = 0 } = payoutsByCurrency[currency]
  if (paidAmount === 0 && inTransitAmount === 0) return undefined

  const code = currency.toUpperCase()
  return [
    {
      items: [
        {
          label: (
            <FormattedMessage
              id="dashboard.contributor.payoutsSummary.paidOut"
              defaultMessage="Paid out"
            />
          ),
          value: formatCurrency(paidAmount, 'en-US', code)
        },
        {
          label: (
            <FormattedMessage
              id="dashboard.contributor.when.inTransit"
              defaultMessage="In transit"
            />
          ),
          value: formatCurrency(inTransitAmount, 'en-US', code)
        },
        {
          label: (
            <FormattedMessage id="dashboard.contributor.claims.total" defaultMessage="Total" />
          ),
          value: formatCurrency(paidAmount + inTransitAmount, 'en-US', code),
          variant: 'emphasis'
        }
      ]
    }
  ]
}

/** Provider account -> <AutoWithdrawalStatus/> props. Whop exposes `payout_schedule`
 * (read from Whop's withdrawal_schedule); Stripe uses `settings.payouts.schedule`.
 * No connected account yet -> `connected: false`, so the control can offer setup. */
export const mapAutoWithdrawalProps = (
  account: any = {}
): {
  connected: boolean
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly' | null
  nextRunDate: string | null
} => {
  const data = account?.data || {}
  if (!data.id) return { connected: false, enabled: false, frequency: null, nextRunDate: null }
  const schedule =
    data.provider === 'whop' ? data.payout_schedule : data.settings?.payouts?.schedule
  const interval = schedule?.interval || null
  const frequency = ['daily', 'weekly', 'monthly'].includes(interval) ? interval : null
  return {
    connected: true,
    enabled: Boolean(frequency),
    frequency,
    nextRunDate: schedule?.next_payout_date || null
  }
}
