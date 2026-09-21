import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Container, Grid } from '@mui/material'
import { Alert, AlertTitle } from '@mui/material'
import CodeIcon from '@mui/icons-material/Code'
import AssignmentIcon from '@mui/icons-material/Assignment'
import LinkIcon from '@mui/icons-material/Link'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { AlertWrapper } from './dashboard.styles'
import WelcomeUser from '../../components/session/welcome-user'
import DashboardCardList from 'design-library/molecules/cards/dashboard-cards/dashboard-card-list/dashboard-card-list'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import RolePill from 'design-library/atoms/badges/role-pill/role-pill'
import CombinedDashboard, {
  CombinedDashboardRole
} from 'design-library/pages/private-pages/dashboard-pages/combined-dashboard/combined-dashboard'
import DashboardOverview from 'design-library/pages/private-pages/dashboard-pages/dashboard-overview/dashboard-overview'
import ContributorDashboard from 'design-library/pages/private-pages/dashboard-pages/contributor-dashboard/contributor-dashboard'
import ServiceProviderDashboard from 'design-library/pages/private-pages/dashboard-pages/service-provider-dashboard/service-provider-dashboard'
import MaintainerDashboard from 'design-library/pages/private-pages/dashboard-pages/maintainer-dashboard/maintainer-dashboard'
import FundingDashboard from 'design-library/pages/private-pages/dashboard-pages/funding-dashboard/funding-dashboard'
import AccountRequirements from 'design-library/atoms/alerts/account-requirements/account-requirements'
import useUserTypes from '../../../../../hooks/use-user-types'
import {
  mapWorkItems,
  mapSolutions,
  mapPayoutRows,
  mapStats,
  mapClaimsSections,
  mapPayoutsSummarySections,
  mapChecklist
} from './contributor-dashboard.mappers'
import {
  mapPaymentLinks,
  mapPaymentsReceived,
  mapProviderStats,
  mapProviderChecklist
} from './service-provider-dashboard.mappers'
import {
  mapOpenIssues,
  mapClosedIssues,
  mapMaintainerPayments,
  mapMaintainerStats,
  mapMaintainerChecklist,
  mapWalletSection
} from './maintainer-dashboard.mappers'
import {
  mapFundingPayments,
  mapFundingStats,
  mapFundingChecklist
} from './funding-dashboard.mappers'
import {
  mapOverviewStats,
  mapContributorSection,
  mapProviderSection,
  mapMaintainerSection,
  mapFundingSection
} from './dashboard-overview.mappers'

const Dashboard = ({
  user,
  dashboard,
  account,
  tasks,
  maintainerTasks,
  taskSolutions,
  payouts,
  paymentRequests,
  paymentRequestPayments,
  projects,
  transfers,
  orders,
  fetchDashboardInfo,
  fetchAccount,
  listTasks,
  listMaintainerTasks,
  listTaskSolutions,
  searchPayout,
  listPaymentRequests,
  listPaymentRequestPayments,
  listProjects,
  searchTransfer,
  listOrders,
  addNotification
}) => {
  const { data = {}, completed } = user
  const { isContributor, isProvider, isMaintainer, isFunding } = useUserTypes({ user })

  const history = useHistory()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const createTaskError = searchParams.get('createTaskError')
  const message = searchParams.get('message')

  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    completed && data?.Types?.length === 0 && setVisible(true)
    fetchDashboardInfo()
  }, [data, completed])

  React.useEffect(() => {
    if (completed && isContributor) {
      listTasks({ assignedTo: data.id, limit: 5 })
      listTaskSolutions()
      searchPayout()
      fetchAccount()
    }
  }, [completed, isContributor, data.id])

  React.useEffect(() => {
    if (completed && isProvider) {
      listPaymentRequests()
      listPaymentRequestPayments()
      fetchAccount()
    }
  }, [completed, isProvider, data.id])

  React.useEffect(() => {
    if (completed && isMaintainer) {
      listMaintainerTasks({ userId: data.id, limit: 20 })
      listProjects({ userId: data.id })
      searchTransfer({ userId: true })
    }
  }, [completed, isMaintainer, data.id])

  React.useEffect(() => {
    if (completed && isFunding) {
      listOrders({ userId: data.id })
    }
  }, [completed, isFunding, data.id])

  React.useEffect(() => {
    if (createTaskError === 'true' && message) {
      if (message.length > 0) {
        try {
          const decodedMessage = decodeURIComponent(message)
          addNotification(decodedMessage, { variant: 'error' })
        } catch (e) {
          console.error('Error decoding message:', e)
          addNotification(message, { variant: 'error' })
        }
      }
    }
  }, [createTaskError, message])

  const handleGoToPayoutSettings = () => history.push('/profile/payout-settings')
  const handleGoToExplore = () => history.push('/profile/explore')
  const handleGoToGithubConnect = () => history.push('/profile/user-account')
  const handleGoToPaymentRequests = () => history.push('/profile/payment-requests')

  const allCompleted =
    completed &&
    dashboard.completed &&
    account.completed &&
    tasks.completed &&
    taskSolutions.completed &&
    payouts.completed

  const allProviderCompleted =
    completed &&
    dashboard.completed &&
    account.completed &&
    paymentRequests.completed &&
    paymentRequestPayments.completed

  const allMaintainerCompleted =
    completed &&
    dashboard.completed &&
    maintainerTasks.completed &&
    projects.completed &&
    transfers.completed

  const allFundingCompleted = completed && dashboard.completed && orders.completed

  const overviewCompleted =
    (!isContributor || allCompleted) &&
    (!isProvider || allProviderCompleted) &&
    (!isMaintainer || allMaintainerCompleted) &&
    (!isFunding || allFundingCompleted)

  const banner = (
    <AccountRequirements user={data} account={account} onClick={handleGoToPayoutSettings} />
  )

  const roles: CombinedDashboardRole[] = []

  if (isContributor) {
    roles.push({
      key: 'contributor',
      tabLabel: (
        <>
          <CodeIcon fontSize="small" />
          <FormattedMessage id="dashboard.contributor.role" defaultMessage="Contributor" />
        </>
      ),
      content: (
        <ContributorDashboard
          completed={allCompleted}
          banner={banner}
          stats={mapStats(dashboard.data, taskSolutions.data)}
          workItems={mapWorkItems(tasks.data)}
          solutions={mapSolutions(taskSolutions.data)}
          payouts={mapPayoutRows(payouts.data)}
          claims={mapClaimsSections(dashboard.data)}
          payoutsSummary={mapPayoutsSummarySections(dashboard.data)}
          {...mapChecklist({
            user: data,
            account,
            hasClaimedIssue: (tasks.totalCount ?? tasks.data.length) > 0,
            onConnectGithubClick: handleGoToGithubConnect,
            onClaimIssueClick: handleGoToExplore,
            onConnectPayoutClick: handleGoToPayoutSettings
          })}
          onExploreIssuesClick={handleGoToExplore}
          onConnectPayoutClick={handleGoToPayoutSettings}
          onViewWorkItemsClick={() => history.push('/profile/tasks/assigned')}
          onViewSolutionsClick={() => history.push('/profile/solutions')}
          onViewPayoutsClick={() => history.push('/profile/payouts')}
          onViewClaimsClick={() => history.push('/profile/claims')}
          onViewPayoutsSummaryClick={() => history.push('/profile/payouts')}
        />
      )
    })
  }

  if (isProvider) {
    roles.push({
      key: 'provider',
      tabLabel: (
        <>
          <LinkIcon fontSize="small" />
          <FormattedMessage id="dashboard.provider.role" defaultMessage="Service provider" />
        </>
      ),
      content: (
        <ServiceProviderDashboard
          completed={allProviderCompleted}
          banner={banner}
          stats={mapProviderStats(dashboard.data)}
          paymentsReceived={mapPaymentsReceived(paymentRequestPayments.data)}
          paymentLinks={mapPaymentLinks(paymentRequests.data)}
          claims={mapClaimsSections(dashboard.data)}
          payoutsSummary={mapPayoutsSummarySections(dashboard.data)}
          {...mapProviderChecklist({
            user: data,
            account,
            hasCreatedLink: paymentRequests.data.length > 0,
            hasPaidLink: paymentRequestPayments.data.length > 0,
            onCreatePaymentLinkClick: handleGoToPaymentRequests,
            onConnectPayoutClick: handleGoToPayoutSettings
          })}
          onCreatePaymentLinkClick={handleGoToPaymentRequests}
          onViewPaymentsClick={() => history.push('/profile/payment-requests/payments')}
          onViewPaymentLinksClick={handleGoToPaymentRequests}
          onViewClaimsClick={() => history.push('/profile/claims')}
          onViewPayoutsSummaryClick={() => history.push('/profile/payouts')}
        />
      )
    })
  }

  if (isMaintainer) {
    roles.push({
      key: 'maintainer',
      tabLabel: (
        <>
          <AssignmentIcon fontSize="small" />
          <FormattedMessage id="dashboard.maintainer.role" defaultMessage="Maintainer" />
        </>
      ),
      content: (
        <MaintainerDashboard
          completed={allMaintainerCompleted}
          stats={mapMaintainerStats(dashboard.data, projects.data)}
          openIssues={mapOpenIssues(maintainerTasks.data)}
          closedIssues={mapClosedIssues(maintainerTasks.data)}
          recentPayments={mapMaintainerPayments(transfers.data)}
          wallet={mapWalletSection(dashboard.data)}
          {...mapMaintainerChecklist({ user: data, dashboardData: dashboard.data })}
          onFundIssueClick={handleGoToExplore}
          onViewOpenIssuesClick={() => history.push('/profile/tasks/createdbyme')}
          onViewClosedIssuesClick={() => history.push('/profile/tasks/createdbyme')}
          onViewPaymentsClick={() => history.push('/profile/payments')}
          onManageWalletClick={() => history.push('/profile/wallets')}
        />
      )
    })
  }

  if (isFunding) {
    roles.push({
      key: 'funding',
      tabLabel: (
        <>
          <FavoriteIcon fontSize="small" />
          <FormattedMessage id="dashboard.funding.role" defaultMessage="Funding" />
        </>
      ),
      content: (
        <FundingDashboard
          completed={allFundingCompleted}
          stats={mapFundingStats(dashboard.data)}
          recentPayments={mapFundingPayments(orders.data)}
          wallet={mapWalletSection(dashboard.data)}
          {...mapFundingChecklist({ user: data, dashboardData: dashboard.data })}
          onSponsorProjectClick={handleGoToExplore}
          onViewPaymentsClick={() => history.push('/profile/payments')}
          onManageWalletClick={() => history.push('/profile/wallets')}
        />
      )
    })
  }

  // Highest-priority active role's own checklist — same precedence this page has always used
  // (Contributor > Provider > Maintainer > Funding), just selecting between existing checklists
  // rather than building a new one.
  const checklist = isContributor
    ? mapChecklist({
        user: data,
        account,
        hasClaimedIssue: (tasks.totalCount ?? tasks.data.length) > 0,
        onConnectGithubClick: handleGoToGithubConnect,
        onClaimIssueClick: handleGoToExplore,
        onConnectPayoutClick: handleGoToPayoutSettings
      })
    : isProvider
      ? mapProviderChecklist({
          user: data,
          account,
          hasCreatedLink: paymentRequests.data.length > 0,
          hasPaidLink: paymentRequestPayments.data.length > 0,
          onCreatePaymentLinkClick: handleGoToPaymentRequests,
          onConnectPayoutClick: handleGoToPayoutSettings
        })
      : isMaintainer
        ? mapMaintainerChecklist({ user: data, dashboardData: dashboard.data })
        : mapFundingChecklist({ user: data, dashboardData: dashboard.data })

  const overview =
    roles.length > 1 ? (
      <DashboardOverview
        completed={overviewCompleted}
        banner={(isContributor || isProvider) && banner}
        roleBadges={[
          isContributor && (
            <RolePill
              key="contributor"
              name={
                <FormattedMessage id="dashboard.contributor.role" defaultMessage="Contributor" />
              }
              active
              tone="orange"
            />
          ),
          isProvider && (
            <RolePill
              key="provider"
              name={
                <FormattedMessage id="dashboard.provider.role" defaultMessage="Service provider" />
              }
              active
              tone="yellow"
            />
          ),
          isMaintainer && (
            <RolePill
              key="maintainer"
              name={<FormattedMessage id="dashboard.maintainer.role" defaultMessage="Maintainer" />}
              active
              tone="teal"
            />
          ),
          isFunding && (
            <RolePill
              key="funding"
              name={<FormattedMessage id="dashboard.funding.role" defaultMessage="Funding" />}
              active
              tone="pink"
            />
          )
        ].filter(Boolean)}
        roleCount={roles.length}
        stats={mapOverviewStats(dashboard.data)}
        roleSections={[
          isContributor &&
            mapContributorSection({
              dashboardData: dashboard.data,
              tasks: tasks.data,
              onViewWorkItemsClick: () => history.push('/profile/tasks/assigned'),
              onExploreIssuesClick: handleGoToExplore
            }),
          isProvider &&
            mapProviderSection({
              dashboardData: dashboard.data,
              paymentRequests: paymentRequests.data,
              onViewPaymentLinksClick: handleGoToPaymentRequests,
              onCreatePaymentLinkClick: handleGoToPaymentRequests
            }),
          isMaintainer &&
            mapMaintainerSection({
              dashboardData: dashboard.data,
              tasks: maintainerTasks.data,
              projects: projects.data,
              onViewOpenIssuesClick: () => history.push('/profile/tasks/createdbyme'),
              onFundIssueClick: handleGoToExplore
            }),
          isFunding &&
            mapFundingSection({
              dashboardData: dashboard.data,
              orders: orders.data,
              onViewPaymentsClick: () => history.push('/profile/payments'),
              onSponsorProjectClick: handleGoToExplore
            })
        ].filter(Boolean)}
        {...checklist}
        claims={mapClaimsSections(dashboard.data)}
        payoutsSummary={mapPayoutsSummarySections(dashboard.data)}
        wallet={mapWalletSection(dashboard.data)}
        onViewClaimsClick={() => history.push('/profile/claims')}
        onViewPayoutsSummaryClick={() => history.push('/profile/payouts')}
        onManageWalletClick={() => history.push('/profile/wallets')}
      />
    ) : undefined

  return (
    <Container>
      {roles.length === 0 && (
        <Grid container justifyContent="space-between" alignItems="center">
          <MainTitle title={<FormattedMessage id="dashboard.title" defaultMessage="Dashboard" />} />
        </Grid>
      )}
      {window.localStorage.getItem('firstLogin') === 'true' && <WelcomeUser />}
      {visible && (
        <AlertWrapper>
          <Alert
            severity="warning"
            action={
              <Button
                size="small"
                onClick={() => {
                  history.push('/profile/user-account/roles')
                }}
                variant="contained"
                color="secondary"
              >
                <FormattedMessage
                  id="account.profile.alert.button"
                  defaultMessage="Update your profile"
                />
              </Button>
            }
          >
            <AlertTitle>
              <FormattedMessage
                id="account.profile.alert.title"
                defaultMessage="Update your profile"
              />
            </AlertTitle>
            <FormattedMessage
              id="account.profile.alert.description"
              defaultMessage="You need to update your profile to define your user type. Click on the button to update your profile"
            />
          </Alert>
        </AlertWrapper>
      )}
      {roles.length > 0 ? (
        <CombinedDashboard roles={roles} overview={overview} />
      ) : (
        <DashboardCardList user={user} dashboard={dashboard} />
      )}
    </Container>
  )
}

export default Dashboard
