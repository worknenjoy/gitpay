import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Typography } from '@mui/material'
import CodeIcon from '@mui/icons-material/Code'
import MergeTypeIcon from '@mui/icons-material/MergeType'
import PaymentsIcon from '@mui/icons-material/Payments'
import RolePill from 'design-library/atoms/badges/role-pill/role-pill'
import StatGroupCard from 'design-library/molecules/cards/stat-card/stat-group-card'
import ListCard from 'design-library/molecules/cards/list-card/list-card'
import ChecklistCard from 'design-library/molecules/cards/checklist-card/checklist-card'
import ChecklistProgress from 'design-library/molecules/data-display/checklist-progress/checklist-progress'
import SummaryCard from 'design-library/molecules/cards/summary-card/summary-card'
import { Root, Header, HeaderTitleRow, Body, Column } from './contributor-dashboard.styles'

type ContributorDashboardProps = {
  /** completed === false -> every card/alert below renders its own loading state */
  completed?: boolean
  /** Caller-composed notice (e.g. <AccountRequirements/>). Omit to show nothing — the
   * banner owns its own severity/copy/loading. Today this is a single node; later this
   * slot can grow into a proper multi-warning layout without another prop-shape change. */
  banner?: React.ReactNode
  stats: React.ComponentProps<typeof StatGroupCard>['stats']
  workItems: React.ComponentProps<typeof ListCard>['items']
  solutions: React.ComponentProps<typeof ListCard>['items']
  payouts: React.ComponentProps<typeof ListCard>['items']
  checklistProgress: { completed: number; total: number }
  checklistItems: React.ComponentProps<typeof ChecklistCard>['items']
  claims: React.ComponentProps<typeof SummaryCard>['sections']
  /** Omit to hide the Payouts summary card (e.g. no payout history yet) */
  payoutsSummary?: React.ComponentProps<typeof SummaryCard>['sections']
  onExploreIssuesClick?: () => void
  onConnectPayoutClick?: () => void
  onViewWorkItemsClick?: () => void
  onViewSolutionsClick?: () => void
  onViewPayoutsClick?: () => void
  onViewClaimsClick?: () => void
  onViewPayoutsSummaryClick?: () => void
}

const ContributorDashboard = ({
  completed = true,
  banner,
  stats,
  workItems,
  solutions,
  payouts,
  checklistProgress,
  checklistItems,
  claims,
  payoutsSummary,
  onExploreIssuesClick,
  onConnectPayoutClick,
  onViewWorkItemsClick,
  onViewSolutionsClick,
  onViewPayoutsClick,
  onViewClaimsClick,
  onViewPayoutsSummaryClick
}: ContributorDashboardProps) => {
  const isLoading = completed === false

  return (
    <Root>
      <Header>
        <HeaderTitleRow>
          <Typography variant="h3">
            <FormattedMessage id="dashboard.contributor.title" defaultMessage="Dashboard" />
          </Typography>
          <RolePill
            name={<FormattedMessage id="dashboard.contributor.role" defaultMessage="Contributor" />}
            active
            tone="orange"
          />
        </HeaderTitleRow>
        <Typography variant="subtitle1">
          <FormattedMessage
            id="dashboard.contributor.subtitle"
            defaultMessage="What you are working on, what you earned, and when it lands."
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
                id="dashboard.contributor.workItems.title"
                defaultMessage="Work items"
              />
            }
            subtitle={
              <FormattedMessage
                id="dashboard.contributor.workItems.subtitle"
                defaultMessage="Issues you are working on"
              />
            }
            footer={
              <FormattedMessage
                id="dashboard.contributor.workItems.footer"
                defaultMessage="See all your issues"
              />
            }
            items={workItems}
            onFooterClick={onViewWorkItemsClick}
            completed={completed}
            emptyIcon={<CodeIcon fontSize="small" />}
            emptyText={
              <FormattedMessage
                id="dashboard.contributor.workItems.empty"
                defaultMessage="No issues yet. Claim an issue from Explore and it shows up here while you work on it."
              />
            }
            emptyActionText={
              <FormattedMessage
                id="dashboard.contributor.workItems.emptyAction"
                defaultMessage="Explore issues"
              />
            }
            onEmptyActionClick={onExploreIssuesClick}
          />
          <ListCard
            title={
              <FormattedMessage
                id="dashboard.contributor.solutions.title"
                defaultMessage="Solutions"
              />
            }
            subtitle={
              <FormattedMessage
                id="dashboard.contributor.solutions.subtitle"
                defaultMessage="Solutions you sent and the ones that were merged"
              />
            }
            footer={
              <FormattedMessage
                id="dashboard.contributor.solutions.footer"
                defaultMessage="See all your solutions"
              />
            }
            items={solutions}
            onFooterClick={onViewSolutionsClick}
            completed={completed}
            emptyIcon={<MergeTypeIcon fontSize="small" />}
            emptyText={
              <FormattedMessage
                id="dashboard.contributor.solutions.empty"
                defaultMessage="No solutions sent. Send a pull request from an issue you claimed and it appears here with its bounty."
              />
            }
          />
          <ListCard
            title={
              <FormattedMessage
                id="dashboard.contributor.payouts.title"
                defaultMessage="Recent payouts"
              />
            }
            subtitle={
              <FormattedMessage
                id="dashboard.contributor.payouts.subtitle"
                defaultMessage="Payouts to your connected accounts"
              />
            }
            footer={
              <FormattedMessage
                id="dashboard.contributor.payouts.footer"
                defaultMessage="See all your payouts"
              />
            }
            items={payouts}
            onFooterClick={onViewPayoutsClick}
            completed={completed}
            emptyIcon={<PaymentsIcon fontSize="small" />}
            emptyText={
              <FormattedMessage
                id="dashboard.contributor.payouts.empty"
                defaultMessage="No payouts yet. Once a claim is approved, your payout lands here with its transfer method."
              />
            }
            emptyActionText={
              <FormattedMessage
                id="dashboard.contributor.payouts.emptyAction"
                defaultMessage="Connect a payout method"
              />
            }
            onEmptyActionClick={onConnectPayoutClick}
          />
        </Column>
        <Column>
          <ChecklistCard
            progress={
              <ChecklistProgress
                title={
                  <FormattedMessage
                    id="dashboard.contributor.checklist.title"
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
            title={
              <FormattedMessage id="dashboard.contributor.claims.title" defaultMessage="Claims" />
            }
            sections={claims}
            note={
              <FormattedMessage
                id="dashboard.contributor.claims.note"
                defaultMessage="A claim is processed when your work is claimed and then it goes to payout and send to your account based on your payout preferences."
              />
            }
            cta={
              <FormattedMessage
                id="dashboard.contributor.claims.cta"
                defaultMessage="See your claims"
              />
            }
            onCtaClick={onViewClaimsClick}
            completed={completed}
          />
          {(isLoading || (payoutsSummary && payoutsSummary.length > 0)) && (
            <SummaryCard
              title={
                <FormattedMessage
                  id="dashboard.contributor.payoutsSummary.title"
                  defaultMessage="Payouts"
                />
              }
              sections={payoutsSummary ?? []}
              note={
                <FormattedMessage
                  id="dashboard.contributor.payoutsSummary.note"
                  defaultMessage="These payouts will be sent to your connected account."
                />
              }
              cta={
                <FormattedMessage
                  id="dashboard.contributor.payoutsSummary.cta"
                  defaultMessage="See all payouts"
                />
              }
              onCtaClick={onViewPayoutsSummaryClick}
              completed={completed}
            />
          )}
        </Column>
      </Body>
    </Root>
  )
}

export default ContributorDashboard
