import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Typography } from '@mui/material'
import PaymentsIcon from '@mui/icons-material/Payments'
import LinkIcon from '@mui/icons-material/Link'
import RolePill from 'design-library/atoms/badges/role-pill/role-pill'
import StatGroupCard from 'design-library/molecules/cards/stat-card/stat-group-card'
import ListCard from 'design-library/molecules/cards/list-card/list-card'
import GetStartedCard from 'design-library/molecules/cards/get-started-card/get-started-card'
import SummaryCard from 'design-library/molecules/cards/summary-card/summary-card'
import { Root, Header, HeaderTitleRow, Body, Column } from '../dashboard-page-layout.styles'

type ServiceProviderDashboardProps = {
  /** completed === false -> every card/alert below renders its own loading state */
  completed?: boolean
  /** Caller-composed notice (e.g. <AccountRequirements/>). Same slot as ContributorDashboard. */
  banner?: React.ReactNode
  /** Multi-role accounts only — the role switcher (<CombinedDashboard/> injects it). */
  switcher?: React.ReactNode
  stats: React.ComponentProps<typeof StatGroupCard>['stats']
  paymentsReceived: React.ComponentProps<typeof ListCard>['items']
  paymentLinks: React.ComponentProps<typeof ListCard>['items']
  checklistProgress: { completed: number; total: number }
  checklistItems: React.ComponentProps<typeof GetStartedCard>['items']
  claims: React.ComponentProps<typeof SummaryCard>['sections']
  /** Omit to hide the Payouts summary card (e.g. no payout history yet) */
  payoutsSummary?: React.ComponentProps<typeof SummaryCard>['sections']
  onCreatePaymentLinkClick?: () => void
  onViewPaymentsClick?: () => void
  onViewPaymentLinksClick?: () => void
  onViewClaimsClick?: () => void
  onViewPayoutsSummaryClick?: () => void
}

const ServiceProviderDashboard = ({
  completed = true,
  banner,
  switcher,
  stats,
  paymentsReceived,
  paymentLinks,
  checklistProgress,
  checklistItems,
  claims,
  payoutsSummary,
  onCreatePaymentLinkClick,
  onViewPaymentsClick,
  onViewPaymentLinksClick,
  onViewClaimsClick,
  onViewPayoutsSummaryClick
}: ServiceProviderDashboardProps) => {
  const isLoading = completed === false

  return (
    <Root>
      <Header>
        <HeaderTitleRow>
          <Typography variant="h3">
            <FormattedMessage id="dashboard.provider.title" defaultMessage="Dashboard" />
          </Typography>
          <RolePill
            name={
              <FormattedMessage id="dashboard.provider.role" defaultMessage="Service provider" />
            }
            active
            tone="yellow"
          />
        </HeaderTitleRow>
        <Typography variant="subtitle1">
          <FormattedMessage
            id="dashboard.provider.subtitle"
            defaultMessage="Links you share with clients and the money they bring in."
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
                id="dashboard.provider.paymentsReceived.title"
                defaultMessage="Payments received"
              />
            }
            subtitle={
              <FormattedMessage
                id="dashboard.provider.paymentsReceived.subtitle"
                defaultMessage="Payments settled through your links"
              />
            }
            footer={
              <FormattedMessage
                id="dashboard.provider.paymentsReceived.footer"
                defaultMessage="See all your payments"
              />
            }
            items={paymentsReceived}
            onFooterClick={onViewPaymentsClick}
            completed={completed}
            emptyIcon={<PaymentsIcon fontSize="small" />}
            emptyText={
              <FormattedMessage
                id="dashboard.provider.paymentsReceived.empty"
                defaultMessage="No payments yet. Once a client pays one of your links, it shows up here."
              />
            }
          />
          <ListCard
            title={
              <FormattedMessage
                id="dashboard.provider.paymentLinks.title"
                defaultMessage="Payment links"
              />
            }
            subtitle={
              <FormattedMessage
                id="dashboard.provider.paymentLinks.subtitle"
                defaultMessage="Links you share with clients to get paid"
              />
            }
            footer={
              <FormattedMessage
                id="dashboard.provider.paymentLinks.footer"
                defaultMessage="See all your payment links"
              />
            }
            items={paymentLinks}
            onFooterClick={onViewPaymentLinksClick}
            completed={completed}
            emptyIcon={<LinkIcon fontSize="small" />}
            emptyText={
              <FormattedMessage
                id="dashboard.provider.paymentLinks.empty"
                defaultMessage="No payment links yet. Create one to start getting paid."
              />
            }
            emptyActionText={
              <FormattedMessage
                id="dashboard.provider.paymentLinks.emptyAction"
                defaultMessage="Create a payment link"
              />
            }
            onEmptyActionClick={onCreatePaymentLinkClick}
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
              <FormattedMessage id="dashboard.provider.claims.title" defaultMessage="Claims" />
            }
            sections={claims}
            note={
              <FormattedMessage
                id="dashboard.provider.claims.note"
                defaultMessage="A claim is processed when your link is paid and then it goes to payout and send to your account based on your payout preferences."
              />
            }
            cta={
              <FormattedMessage
                id="dashboard.provider.claims.cta"
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
                  id="dashboard.provider.payoutsSummary.title"
                  defaultMessage="Payouts"
                />
              }
              sections={payoutsSummary ?? []}
              note={
                <FormattedMessage
                  id="dashboard.provider.payoutsSummary.note"
                  defaultMessage="These payouts will be sent to your connected account."
                />
              }
              cta={
                <FormattedMessage
                  id="dashboard.provider.payoutsSummary.cta"
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

export default ServiceProviderDashboard
