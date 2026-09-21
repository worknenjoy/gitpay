import React from 'react'
import { FormattedMessage } from 'react-intl'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import CodeIcon from '@mui/icons-material/Code'
import AssignmentIcon from '@mui/icons-material/Assignment'
import LinkIcon from '@mui/icons-material/Link'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PaymentsIcon from '@mui/icons-material/Payments'
import { StatGroupCardItem } from 'design-library/molecules/cards/stat-card/stat-group-card'
import { RoleOverviewSection } from 'design-library/pages/private-pages/dashboard-pages/dashboard-overview/dashboard-overview'
import { formatCurrency } from '../../../../../utils/format-currency'
import { formatAmount } from './dashboard-shared.mappers'
import { mapWorkItems } from './contributor-dashboard.mappers'
import { mapOpenIssues } from './maintainer-dashboard.mappers'
import { mapPaymentLinks } from './service-provider-dashboard.mappers'
import { mapFundingPayments } from './funding-dashboard.mappers'

/** The Overview's 4 top stats need no new backend work — userInfo.ts already computes these as
 * single, role-agnostic aggregates that every per-role dashboard already reads a narrower slice
 * of (see dashboard-overview.mappers.tsx in the design library plan for the field mapping). */
export const mapOverviewStats = (dashboardData: any = {}): StatGroupCardItem[] => [
  {
    icon: <AttachMoneyIcon fontSize="small" />,
    label: (
      <FormattedMessage id="dashboard.combined.stats.moneyIn.label" defaultMessage="Money in" />
    ),
    currency: '$',
    value: formatAmount(dashboardData.claims?.amount),
    note: (
      <FormattedMessage
        id="dashboard.combined.stats.moneyIn.note"
        defaultMessage="earned and received, all time"
      />
    )
  },
  {
    icon: <ShoppingCartIcon fontSize="small" />,
    label: (
      <FormattedMessage id="dashboard.combined.stats.moneyOut.label" defaultMessage="Money out" />
    ),
    currency: '$',
    value: formatAmount(dashboardData.payments?.amount),
    note: (
      <FormattedMessage
        id="dashboard.combined.stats.moneyOut.note"
        defaultMessage="funding and bounties paid"
      />
    )
  },
  {
    icon: <AccessTimeIcon fontSize="small" />,
    label: (
      <FormattedMessage
        id="dashboard.combined.stats.awaitingPayout.label"
        defaultMessage="Awaiting payout"
      />
    ),
    currency: '$',
    value: formatAmount(dashboardData.awaitingPayoutAmount),
    note: (
      <FormattedMessage
        id="dashboard.combined.stats.awaitingPayout.note"
        defaultMessage="in the payout queue"
      />
    )
  },
  {
    icon: <AccountBalanceWalletIcon fontSize="small" />,
    label: (
      <FormattedMessage
        id="dashboard.combined.stats.walletBalance.label"
        defaultMessage="Wallet balance"
      />
    ),
    currency: '$',
    value: formatAmount(dashboardData.wallets?.balance),
    note: (
      <FormattedMessage
        id="dashboard.combined.stats.walletBalance.note"
        defaultMessage="{count} wallet created"
        values={{ count: dashboardData.wallets?.total ?? 0 }}
      />
    )
  }
]

export const mapContributorSection = ({
  dashboardData,
  tasks,
  onViewWorkItemsClick,
  onExploreIssuesClick
}: {
  dashboardData: any
  tasks: any[]
  onViewWorkItemsClick?: () => void
  onExploreIssuesClick?: () => void
}): RoleOverviewSection => {
  const openCount = tasks.filter((task) => task.status === 'open').length

  return {
    key: 'contributor',
    icon: <CodeIcon fontSize="small" />,
    label: <FormattedMessage id="dashboard.contributor.role" defaultMessage="Contributor" />,
    sub: (
      <FormattedMessage
        id="dashboard.combined.roleSection.contributor.sub"
        defaultMessage="{amount} earned · {count} issues open"
        values={{ amount: formatCurrency(dashboardData.claims?.amount ?? 0), count: openCount }}
      />
    ),
    linkText: (
      <FormattedMessage
        id="dashboard.combined.roleSection.contributor.link"
        defaultMessage="Open contributor view"
      />
    ),
    panelTitle: (
      <FormattedMessage id="dashboard.contributor.workItems.title" defaultMessage="Work items" />
    ),
    panelSubtitle: (
      <FormattedMessage
        id="dashboard.contributor.workItems.subtitle"
        defaultMessage="Issues you are working on"
      />
    ),
    panelFooter: (
      <FormattedMessage
        id="dashboard.contributor.workItems.footer"
        defaultMessage="See all your issues"
      />
    ),
    onFooterClick: onViewWorkItemsClick,
    items: mapWorkItems(tasks),
    emptyIcon: <CodeIcon fontSize="small" />,
    emptyText: (
      <FormattedMessage
        id="dashboard.contributor.workItems.empty"
        defaultMessage="No issues yet. Claim an issue from Explore and it shows up here while you work on it."
      />
    ),
    emptyActionText: (
      <FormattedMessage
        id="dashboard.contributor.workItems.emptyAction"
        defaultMessage="Explore issues"
      />
    ),
    onEmptyActionClick: onExploreIssuesClick
  }
}

export const mapMaintainerSection = ({
  dashboardData,
  tasks,
  projects,
  onViewOpenIssuesClick,
  onFundIssueClick
}: {
  dashboardData: any
  tasks: any[]
  projects: any[]
  onViewOpenIssuesClick?: () => void
  onFundIssueClick?: () => void
}): RoleOverviewSection => {
  const organizations = new Set(projects.map((project) => project.Organization?.id).filter(Boolean))
    .size

  return {
    key: 'maintainer',
    icon: <AssignmentIcon fontSize="small" />,
    label: <FormattedMessage id="dashboard.maintainer.role" defaultMessage="Maintainer" />,
    sub: (
      <FormattedMessage
        id="dashboard.combined.roleSection.maintainer.sub"
        defaultMessage="{amount} paid · {projects} projects in {orgs} organizations"
        values={{
          amount: formatCurrency(dashboardData.payments?.amount ?? 0),
          projects: projects.length,
          orgs: organizations
        }}
      />
    ),
    linkText: (
      <FormattedMessage
        id="dashboard.combined.roleSection.maintainer.link"
        defaultMessage="Open maintainer view"
      />
    ),
    panelTitle: (
      <FormattedMessage id="dashboard.maintainer.openIssues.title" defaultMessage="Open issues" />
    ),
    panelSubtitle: (
      <FormattedMessage
        id="dashboard.maintainer.openIssues.subtitle"
        defaultMessage="Funded issues and who is on them"
      />
    ),
    panelFooter: (
      <FormattedMessage
        id="dashboard.maintainer.openIssues.footer"
        defaultMessage="See all your issues"
      />
    ),
    onFooterClick: onViewOpenIssuesClick,
    items: mapOpenIssues(tasks),
    emptyIcon: <AssignmentIcon fontSize="small" />,
    emptyText: (
      <FormattedMessage
        id="dashboard.maintainer.openIssues.empty"
        defaultMessage="No open issues yet. Fund an issue and it shows up here while contributors work on it."
      />
    ),
    emptyActionText: (
      <FormattedMessage
        id="dashboard.maintainer.openIssues.emptyAction"
        defaultMessage="Fund an issue"
      />
    ),
    onEmptyActionClick: onFundIssueClick
  }
}

export const mapProviderSection = ({
  dashboardData,
  paymentRequests,
  onViewPaymentLinksClick,
  onCreatePaymentLinkClick
}: {
  dashboardData: any
  paymentRequests: any[]
  onViewPaymentLinksClick?: () => void
  onCreatePaymentLinkClick?: () => void
}): RoleOverviewSection => ({
  key: 'provider',
  icon: <LinkIcon fontSize="small" />,
  label: <FormattedMessage id="dashboard.provider.role" defaultMessage="Service provider" />,
  sub: (
    <FormattedMessage
      id="dashboard.combined.roleSection.provider.sub"
      defaultMessage="{amount} revenue · {total} payment links, {active} active"
      values={{
        amount: formatCurrency(dashboardData.claims?.paymentRequests ?? 0),
        total: dashboardData.paymentRequests?.total ?? 0,
        active: dashboardData.paymentRequests?.active ?? 0
      }}
    />
  ),
  linkText: (
    <FormattedMessage
      id="dashboard.combined.roleSection.provider.link"
      defaultMessage="Open provider view"
    />
  ),
  panelTitle: (
    <FormattedMessage id="dashboard.provider.paymentLinks.title" defaultMessage="Payment links" />
  ),
  panelSubtitle: (
    <FormattedMessage
      id="dashboard.provider.paymentLinks.subtitle"
      defaultMessage="Links you share with clients to get paid"
    />
  ),
  panelFooter: (
    <FormattedMessage
      id="dashboard.provider.paymentLinks.footer"
      defaultMessage="See all your payment links"
    />
  ),
  onFooterClick: onViewPaymentLinksClick,
  items: mapPaymentLinks(paymentRequests),
  emptyIcon: <LinkIcon fontSize="small" />,
  emptyText: (
    <FormattedMessage
      id="dashboard.provider.paymentLinks.empty"
      defaultMessage="No payment links yet. Create one to start getting paid."
    />
  ),
  emptyActionText: (
    <FormattedMessage
      id="dashboard.provider.paymentLinks.emptyAction"
      defaultMessage="Create a payment link"
    />
  ),
  onEmptyActionClick: onCreatePaymentLinkClick
})

export const mapFundingSection = ({
  dashboardData,
  orders,
  onViewPaymentsClick,
  onSponsorProjectClick
}: {
  dashboardData: any
  orders: any[]
  onViewPaymentsClick?: () => void
  onSponsorProjectClick?: () => void
}): RoleOverviewSection => ({
  key: 'funding',
  icon: <FavoriteIcon fontSize="small" />,
  label: <FormattedMessage id="dashboard.funding.role" defaultMessage="Funding" />,
  sub: (
    <FormattedMessage
      id="dashboard.combined.roleSection.funding.sub"
      defaultMessage="{amount} funded across {projects} projects"
      values={{
        amount: formatCurrency(dashboardData.payments?.amount ?? 0),
        projects: dashboardData.payments?.distinctProjects ?? 0
      }}
    />
  ),
  linkText: (
    <FormattedMessage
      id="dashboard.combined.roleSection.funding.link"
      defaultMessage="Open funding view"
    />
  ),
  panelTitle: (
    <FormattedMessage id="dashboard.funding.payments.title" defaultMessage="Recent payments" />
  ),
  panelSubtitle: (
    <FormattedMessage
      id="dashboard.funding.payments.subtitle"
      defaultMessage="Sponsorships and bounties paid from your funding"
    />
  ),
  panelFooter: (
    <FormattedMessage
      id="dashboard.funding.payments.footer"
      defaultMessage="See all your payments"
    />
  ),
  onFooterClick: onViewPaymentsClick,
  items: mapFundingPayments(orders),
  emptyIcon: <PaymentsIcon fontSize="small" />,
  emptyText: (
    <FormattedMessage
      id="dashboard.funding.payments.empty"
      defaultMessage="No payments yet. Sponsor a project or fund a bounty and it shows up here."
    />
  ),
  emptyActionText: (
    <FormattedMessage
      id="dashboard.funding.payments.emptyAction"
      defaultMessage="Sponsor a project"
    />
  ),
  onEmptyActionClick: onSponsorProjectClick
})
