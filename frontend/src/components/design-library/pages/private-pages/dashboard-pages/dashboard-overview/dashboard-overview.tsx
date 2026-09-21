import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Typography } from '@mui/material'
import RoleSectionHeader, {
  RoleSectionHeaderProps
} from 'design-library/atoms/data-display/role-section-header/role-section-header'
import StatGroupCard from 'design-library/molecules/cards/stat-card/stat-group-card'
import ListCard from 'design-library/molecules/cards/list-card/list-card'
import GetStartedCard from 'design-library/molecules/cards/get-started-card/get-started-card'
import SummaryCard from 'design-library/molecules/cards/summary-card/summary-card'
import { Root, Header, HeaderTitleRow, Body, Column } from '../dashboard-page-layout.styles'

export type RoleOverviewSection = Omit<RoleSectionHeaderProps, 'onLinkClick'> & {
  key: string
  panelTitle: React.ReactNode
  panelSubtitle?: React.ReactNode
  panelFooter?: React.ReactNode
  onFooterClick?: () => void
  items: React.ComponentProps<typeof ListCard>['items']
  emptyIcon?: React.ComponentProps<typeof ListCard>['emptyIcon']
  emptyText?: React.ComponentProps<typeof ListCard>['emptyText']
  emptyActionText?: React.ComponentProps<typeof ListCard>['emptyActionText']
  onEmptyActionClick?: React.ComponentProps<typeof ListCard>['onEmptyActionClick']
}

type DashboardOverviewProps = {
  /** completed === false -> every card/alert below renders its own loading state */
  completed?: boolean
  /** Caller-composed notice (e.g. <AccountRequirements/>). Same slot as every other dashboard. */
  banner?: React.ReactNode
  /** The role switcher (<CombinedDashboard/> injects it). */
  switcher?: React.ReactNode
  /** Jump straight to a role's own tab (<CombinedDashboard/> injects it) — used by each role
   * section's "Open X view" link. */
  onNavigateToRole?: (key: string) => void
  /** One already-composed <RolePill/> per active role, shown in the header. */
  roleBadges: React.ReactNode[]
  roleCount: number
  stats: React.ComponentProps<typeof StatGroupCard>['stats']
  /** One section per active role, in the order they should appear. */
  roleSections: RoleOverviewSection[]
  checklistProgress: { completed: number; total: number }
  checklistItems: React.ComponentProps<typeof GetStartedCard>['items']
  /** Each summary card is only shown when its sections are non-empty (or while loading). */
  claims?: React.ComponentProps<typeof SummaryCard>['sections']
  payoutsSummary?: React.ComponentProps<typeof SummaryCard>['sections']
  wallet?: React.ComponentProps<typeof SummaryCard>['sections']
  onViewClaimsClick?: () => void
  onViewPayoutsSummaryClick?: () => void
  onManageWalletClick?: () => void
}

const DashboardOverview = ({
  completed = true,
  banner,
  switcher,
  onNavigateToRole,
  roleBadges,
  roleCount,
  stats,
  roleSections,
  checklistProgress,
  checklistItems,
  claims,
  payoutsSummary,
  wallet,
  onViewClaimsClick,
  onViewPayoutsSummaryClick,
  onManageWalletClick
}: DashboardOverviewProps) => {
  const isLoading = completed === false

  return (
    <Root>
      <Header>
        <HeaderTitleRow>
          <Typography variant="h3">
            <FormattedMessage id="dashboard.combined.title" defaultMessage="Dashboard" />
          </Typography>
          {roleBadges.map((badge, index) => (
            <React.Fragment key={index}>{badge}</React.Fragment>
          ))}
        </HeaderTitleRow>
        <Typography variant="subtitle1">
          <FormattedMessage
            id="dashboard.combined.subtitle"
            defaultMessage="{count} roles are active on this account. Money in and money out first, then each role in turn."
            values={{ count: roleCount }}
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
          {roleSections.map((section) => (
            <React.Fragment key={section.key}>
              <RoleSectionHeader
                icon={section.icon}
                label={section.label}
                sub={section.sub}
                linkText={section.linkText}
                onLinkClick={() => onNavigateToRole?.(section.key)}
              />
              <ListCard
                title={section.panelTitle}
                subtitle={section.panelSubtitle}
                footer={section.panelFooter}
                onFooterClick={section.onFooterClick}
                items={section.items}
                limit={2}
                completed={completed}
                emptyIcon={section.emptyIcon}
                emptyText={section.emptyText}
                emptyActionText={section.emptyActionText}
                onEmptyActionClick={section.onEmptyActionClick}
              />
            </React.Fragment>
          ))}
        </Column>
        <Column>
          <GetStartedCard
            progress={checklistProgress}
            items={checklistItems}
            completed={completed}
          />
          {(isLoading || (claims && claims.length > 0)) && (
            <SummaryCard
              title={
                <FormattedMessage id="dashboard.combined.claims.title" defaultMessage="Claims" />
              }
              sections={claims ?? []}
              note={
                <FormattedMessage
                  id="dashboard.combined.claims.note"
                  defaultMessage="A claim is processed when your work is claimed or your link is paid, then it goes to payout and send to your account based on your payout preferences."
                />
              }
              cta={
                <FormattedMessage
                  id="dashboard.combined.claims.cta"
                  defaultMessage="See your claims"
                />
              }
              onCtaClick={onViewClaimsClick}
              completed={completed}
            />
          )}
          {(isLoading || (payoutsSummary && payoutsSummary.length > 0)) && (
            <SummaryCard
              title={
                <FormattedMessage
                  id="dashboard.combined.payoutsSummary.title"
                  defaultMessage="Payouts"
                />
              }
              sections={payoutsSummary ?? []}
              note={
                <FormattedMessage
                  id="dashboard.combined.payoutsSummary.note"
                  defaultMessage="These payouts will be sent to your connected account."
                />
              }
              cta={
                <FormattedMessage
                  id="dashboard.combined.payoutsSummary.cta"
                  defaultMessage="See all payouts"
                />
              }
              onCtaClick={onViewPayoutsSummaryClick}
              completed={completed}
            />
          )}
          {(isLoading || (wallet && wallet.length > 0)) && (
            <SummaryCard
              title={
                <FormattedMessage id="dashboard.combined.wallet.title" defaultMessage="Wallet" />
              }
              sections={wallet ?? []}
              note={
                <FormattedMessage
                  id="dashboard.combined.wallet.note"
                  defaultMessage="A wallet lets you fund several bounties from one balance instead of paying per issue."
                />
              }
              cta={
                <FormattedMessage
                  id="dashboard.combined.wallet.cta"
                  defaultMessage="Manage wallet"
                />
              }
              onCtaClick={onManageWalletClick}
              completed={completed}
            />
          )}
        </Column>
      </Body>
    </Root>
  )
}

export default DashboardOverview
