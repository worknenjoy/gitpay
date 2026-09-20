import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Typography } from '@mui/material'
import PaymentsIcon from '@mui/icons-material/Payments'
import RolePill from 'design-library/atoms/badges/role-pill/role-pill'
import StatGroupCard from 'design-library/molecules/cards/stat-card/stat-group-card'
import ListCard from 'design-library/molecules/cards/list-card/list-card'
import ChecklistCard from 'design-library/molecules/cards/checklist-card/checklist-card'
import ChecklistProgress from 'design-library/molecules/data-display/checklist-progress/checklist-progress'
import SummaryCard from 'design-library/molecules/cards/summary-card/summary-card'
import { Root, Header, HeaderTitleRow, Body, Column } from '../dashboard-page-layout.styles'

type FundingDashboardProps = {
  /** completed === false -> every card/alert below renders its own loading state */
  completed?: boolean
  /** Caller-composed notice (e.g. <AccountRequirements/>). Same slot as the other dashboards. */
  banner?: React.ReactNode
  stats: React.ComponentProps<typeof StatGroupCard>['stats']
  recentPayments: React.ComponentProps<typeof ListCard>['items']
  checklistProgress: { completed: number; total: number }
  checklistItems: React.ComponentProps<typeof ChecklistCard>['items']
  wallet: React.ComponentProps<typeof SummaryCard>['sections']
  onSponsorProjectClick?: () => void
  onViewPaymentsClick?: () => void
  onManageWalletClick?: () => void
}

const FundingDashboard = ({
  completed = true,
  banner,
  stats,
  recentPayments,
  checklistProgress,
  checklistItems,
  wallet,
  onSponsorProjectClick,
  onViewPaymentsClick,
  onManageWalletClick
}: FundingDashboardProps) => {
  const isLoading = completed === false

  return (
    <Root>
      <Header>
        <HeaderTitleRow>
          <Typography variant="h3">
            <FormattedMessage id="dashboard.funding.title" defaultMessage="Dashboard" />
          </Typography>
          <RolePill
            name={<FormattedMessage id="dashboard.funding.role" defaultMessage="Funding" />}
            active
            tone="pink"
          />
        </HeaderTitleRow>
        <Typography variant="subtitle1">
          <FormattedMessage
            id="dashboard.funding.subtitle"
            defaultMessage="Projects you back, bounty pools you opened, and what has been paid from them."
          />
        </Typography>
      </Header>

      {banner}

      <StatGroupCard
        stats={isLoading ? stats.map((stat) => ({ ...stat, completed: false })) : stats}
      />

      <Body>
        <Column>
          <ListCard
            title={
              <FormattedMessage
                id="dashboard.funding.payments.title"
                defaultMessage="Recent payments"
              />
            }
            subtitle={
              <FormattedMessage
                id="dashboard.funding.payments.subtitle"
                defaultMessage="Sponsorships and bounties paid from your funding"
              />
            }
            footer={
              <FormattedMessage
                id="dashboard.funding.payments.footer"
                defaultMessage="See all your payments"
              />
            }
            items={recentPayments}
            onFooterClick={onViewPaymentsClick}
            completed={completed}
            emptyIcon={<PaymentsIcon fontSize="small" />}
            emptyText={
              <FormattedMessage
                id="dashboard.funding.payments.empty"
                defaultMessage="No payments yet. Sponsor a project or fund a bounty and it shows up here."
              />
            }
            emptyActionText={
              <FormattedMessage
                id="dashboard.funding.payments.emptyAction"
                defaultMessage="Sponsor a project"
              />
            }
            onEmptyActionClick={onSponsorProjectClick}
          />
        </Column>
        <Column>
          <ChecklistCard
            progress={
              <ChecklistProgress
                title={
                  <FormattedMessage
                    id="dashboard.funding.checklist.title"
                    defaultMessage="Get started"
                  />
                }
                completed={checklistProgress.completed}
                total={checklistProgress.total}
                loading={isLoading}
              />
            }
            items={checklistItems}
            completed={completed}
          />
          <SummaryCard
            title={<FormattedMessage id="dashboard.funding.wallet.title" defaultMessage="Wallet" />}
            sections={wallet}
            note={
              <FormattedMessage
                id="dashboard.funding.wallet.note"
                defaultMessage="A wallet lets you fund several bounties from one balance instead of paying per issue."
              />
            }
            cta={
              <FormattedMessage id="dashboard.funding.wallet.cta" defaultMessage="Manage wallet" />
            }
            onCtaClick={onManageWalletClick}
            completed={completed}
          />
        </Column>
      </Body>
    </Root>
  )
}

export default FundingDashboard
