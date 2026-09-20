import React from 'react'
import { Typography } from '@mui/material'
import CodeIcon from '@mui/icons-material/Code'
import MergeTypeIcon from '@mui/icons-material/MergeType'
import PaymentsIcon from '@mui/icons-material/Payments'
import RolePill from 'design-library/atoms/badges/role-pill/role-pill'
import CustomAlert from 'design-library/atoms/alerts/alert/alert'
import StatGroupCard from 'design-library/molecules/cards/stat-card/stat-group-card'
import ListCard from 'design-library/molecules/cards/list-card/list-card'
import ChecklistCard from 'design-library/molecules/cards/checklist-card/checklist-card'
import ChecklistProgress from 'design-library/molecules/data-display/checklist-progress/checklist-progress'
import SummaryCard from 'design-library/molecules/cards/summary-card/summary-card'
import { Root, Header, HeaderTitleRow, Body, Column } from './contributor-dashboard.styles'

type ContributorDashboardProps = {
  /** completed === false -> every card/alert below renders its own loading state */
  completed?: boolean
  /** Omit to hide the notice entirely (e.g. nothing to pay out yet) */
  payoutAlert?: { balance: React.ReactNode; onConnect?: () => void }
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
}

const ContributorDashboard = ({
  completed = true,
  payoutAlert,
  stats,
  workItems,
  solutions,
  payouts,
  checklistProgress,
  checklistItems,
  claims,
  payoutsSummary,
  onExploreIssuesClick,
  onConnectPayoutClick
}: ContributorDashboardProps) => {
  const isLoading = completed === false

  return (
    <Root>
      <Header>
        <HeaderTitleRow>
          <Typography variant="h3">Dashboard</Typography>
          <RolePill name="Contributor" active tone="orange" />
        </HeaderTitleRow>
        <Typography variant="subtitle1">
          What you are working on, what you earned, and when it lands.
        </Typography>
      </Header>

      {(isLoading || payoutAlert) && (
        <CustomAlert
          severity="warning"
          completed={!isLoading}
          actions={
            payoutAlert
              ? [{ label: 'Connect a payout method', onClick: payoutAlert.onConnect }]
              : []
          }
        >
          {payoutAlert && (
            <>
              <Typography variant="subtitle2">
                Action needed
              </Typography>
              <Typography variant="body2">
                Set up payouts to receive your {payoutAlert.balance}
              </Typography>
            </>
          )}
        </CustomAlert>
      )}

      <StatGroupCard
        stats={isLoading ? stats.map((stat) => ({ ...stat, completed: false })) : stats}
      />

      <Body>
        <Column>
          <ListCard
            title="Work items"
            subtitle="Issues you are working on"
            footer="See all your issues"
            items={workItems}
            completed={completed}
            emptyIcon={<CodeIcon fontSize="small" />}
            emptyText="No issues yet. Claim an issue from Explore and it shows up here while you work on it."
            emptyActionText="Explore issues"
            onEmptyActionClick={onExploreIssuesClick}
          />
          <ListCard
            title="Solutions"
            subtitle="Solutions you sent and the ones that were merged"
            footer="See all your solutions"
            items={solutions}
            completed={completed}
            emptyIcon={<MergeTypeIcon fontSize="small" />}
            emptyText="No solutions sent. Send a pull request from an issue you claimed and it appears here with its bounty."
          />
          <ListCard
            title="Recent payouts"
            subtitle="Payouts to your connected accounts"
            footer="See all your payouts"
            items={payouts}
            completed={completed}
            emptyIcon={<PaymentsIcon fontSize="small" />}
            emptyText="No payouts yet. Once a claim is approved, your payout lands here with its transfer method."
            emptyActionText="Connect a payout method"
            onEmptyActionClick={onConnectPayoutClick}
          />
        </Column>
        <Column>
          <ChecklistCard
            progress={
              <ChecklistProgress
                title="Get started"
                completed={checklistProgress.completed}
                total={checklistProgress.total}
                loading={isLoading}
              />
            }
            items={checklistItems}
            completed={completed}
          />
          <SummaryCard
            title="Claims"
            sections={claims}
            note="A claim is processed when your work is claimed and then it goes to payout and send to your account based on your payout preferences."
            cta="See your claims"
            completed={completed}
          />
          {(isLoading || (payoutsSummary && payoutsSummary.length > 0)) && (
            <SummaryCard
              title="Payouts"
              sections={payoutsSummary ?? []}
              note="These payouts will be sent to your connected account."
              cta="See all payouts"
              completed={completed}
            />
          )}
        </Column>
      </Body>
    </Root>
  )
}

export default ContributorDashboard
