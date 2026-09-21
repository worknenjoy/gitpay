import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Typography } from '@mui/material'
import IssueIcon from '@mui/icons-material/Assignment'
import PaymentsIcon from '@mui/icons-material/Payments'
import RolePill from 'design-library/atoms/badges/role-pill/role-pill'
import StatGroupCard from 'design-library/molecules/cards/stat-card/stat-group-card'
import ListCard from 'design-library/molecules/cards/list-card/list-card'
import GetStartedCard from 'design-library/molecules/cards/get-started-card/get-started-card'
import SummaryCard from 'design-library/molecules/cards/summary-card/summary-card'
import { Root, Header, HeaderTitleRow, Body, Column } from '../dashboard-page-layout.styles'

type MaintainerDashboardProps = {
  /** completed === false -> every card/alert below renders its own loading state */
  completed?: boolean
  /** Caller-composed notice (e.g. <AccountRequirements/>). Same slot as the other dashboards. */
  banner?: React.ReactNode
  /** Multi-role accounts only — the role switcher (<CombinedDashboard/> injects it). */
  switcher?: React.ReactNode
  stats: React.ComponentProps<typeof StatGroupCard>['stats']
  openIssues: React.ComponentProps<typeof ListCard>['items']
  closedIssues: React.ComponentProps<typeof ListCard>['items']
  recentPayments: React.ComponentProps<typeof ListCard>['items']
  checklistProgress: { completed: number; total: number }
  checklistItems: React.ComponentProps<typeof GetStartedCard>['items']
  wallet: React.ComponentProps<typeof SummaryCard>['sections']
  onFundIssueClick?: () => void
  onViewOpenIssuesClick?: () => void
  onViewClosedIssuesClick?: () => void
  onViewPaymentsClick?: () => void
  onManageWalletClick?: () => void
}

const MaintainerDashboard = ({
  completed = true,
  banner,
  switcher,
  stats,
  openIssues,
  closedIssues,
  recentPayments,
  checklistProgress,
  checklistItems,
  wallet,
  onFundIssueClick,
  onViewOpenIssuesClick,
  onViewClosedIssuesClick,
  onViewPaymentsClick,
  onManageWalletClick
}: MaintainerDashboardProps) => {
  const isLoading = completed === false

  return (
    <Root>
      <Header>
        <HeaderTitleRow>
          <Typography variant="h3">
            <FormattedMessage id="dashboard.maintainer.title" defaultMessage="Dashboard" />
          </Typography>
          <RolePill
            name={<FormattedMessage id="dashboard.maintainer.role" defaultMessage="Maintainer" />}
            active
            tone="teal"
          />
        </HeaderTitleRow>
        <Typography variant="subtitle1">
          <FormattedMessage
            id="dashboard.maintainer.subtitle"
            defaultMessage="Issues you brought to Gitpay, what they cost, and who is working on them."
          />
        </Typography>
      </Header>

      {switcher}

      {banner}

      <StatGroupCard
        stats={isLoading ? stats.map((stat) => ({ ...stat, completed: false })) : stats}
      />

      <Body>
        <Column>
          <ListCard
            title={
              <FormattedMessage
                id="dashboard.maintainer.openIssues.title"
                defaultMessage="Open issues"
              />
            }
            subtitle={
              <FormattedMessage
                id="dashboard.maintainer.openIssues.subtitle"
                defaultMessage="Funded issues and who is on them"
              />
            }
            footer={
              <FormattedMessage
                id="dashboard.maintainer.openIssues.footer"
                defaultMessage="See all your issues"
              />
            }
            items={openIssues}
            onFooterClick={onViewOpenIssuesClick}
            completed={completed}
            emptyIcon={<IssueIcon fontSize="small" />}
            emptyText={
              <FormattedMessage
                id="dashboard.maintainer.openIssues.empty"
                defaultMessage="No open issues yet. Fund an issue and it shows up here while contributors work on it."
              />
            }
            emptyActionText={
              <FormattedMessage
                id="dashboard.maintainer.openIssues.emptyAction"
                defaultMessage="Fund an issue"
              />
            }
            onEmptyActionClick={onFundIssueClick}
          />
          <ListCard
            title={
              <FormattedMessage
                id="dashboard.maintainer.closedIssues.title"
                defaultMessage="Closed issues"
              />
            }
            subtitle={
              <FormattedMessage
                id="dashboard.maintainer.closedIssues.subtitle"
                defaultMessage="Issues that were solved and paid"
              />
            }
            footer={
              <FormattedMessage
                id="dashboard.maintainer.closedIssues.footer"
                defaultMessage="See all closed issues"
              />
            }
            items={closedIssues}
            onFooterClick={onViewClosedIssuesClick}
            completed={completed}
            emptyIcon={<IssueIcon fontSize="small" />}
            emptyText={
              <FormattedMessage
                id="dashboard.maintainer.closedIssues.empty"
                defaultMessage="No closed issues yet. Once a contributor's solution is merged, it shows up here."
              />
            }
          />
          <ListCard
            title={
              <FormattedMessage
                id="dashboard.maintainer.payments.title"
                defaultMessage="Recent payments"
              />
            }
            subtitle={
              <FormattedMessage
                id="dashboard.maintainer.payments.subtitle"
                defaultMessage="Payments released to contributors"
              />
            }
            footer={
              <FormattedMessage
                id="dashboard.maintainer.payments.footer"
                defaultMessage="See all your payments"
              />
            }
            items={recentPayments}
            onFooterClick={onViewPaymentsClick}
            completed={completed}
            emptyIcon={<PaymentsIcon fontSize="small" />}
            emptyText={
              <FormattedMessage
                id="dashboard.maintainer.payments.empty"
                defaultMessage="No payments yet. Once a claim is approved, the payment shows up here."
              />
            }
          />
        </Column>
        <Column>
          <GetStartedCard
            progress={checklistProgress}
            items={checklistItems}
            completed={completed}
          />
          <SummaryCard
            title={
              <FormattedMessage id="dashboard.maintainer.wallet.title" defaultMessage="Wallet" />
            }
            sections={wallet}
            note={
              <FormattedMessage
                id="dashboard.maintainer.wallet.note"
                defaultMessage="A wallet lets you fund several bounties from one balance instead of paying per issue."
              />
            }
            cta={
              <FormattedMessage
                id="dashboard.maintainer.wallet.cta"
                defaultMessage="Manage wallet"
              />
            }
            onCtaClick={onManageWalletClick}
            completed={completed}
          />
        </Column>
      </Body>
    </Root>
  )
}

export default MaintainerDashboard
