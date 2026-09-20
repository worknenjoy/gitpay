import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Container, Grid } from '@mui/material'
import { Alert, AlertTitle } from '@mui/material'
import { AlertWrapper } from './dashboard.styles'
import WelcomeUser from '../../components/session/welcome-user'
import DashboardCardList from 'design-library/molecules/cards/dashboard-cards/dashboard-card-list/dashboard-card-list'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
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

const Dashboard = ({
  user,
  dashboard,
  account,
  tasks,
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
    if (completed && !isContributor && isProvider) {
      listPaymentRequests()
      listPaymentRequestPayments()
      fetchAccount()
    }
  }, [completed, isContributor, isProvider, data.id])

  React.useEffect(() => {
    if (completed && !isContributor && !isProvider && isMaintainer) {
      listTasks({ userId: data.id, limit: 20 })
      listProjects({ userId: data.id })
      searchTransfer({ userId: true })
    }
  }, [completed, isContributor, isProvider, isMaintainer, data.id])

  React.useEffect(() => {
    if (completed && !isContributor && !isProvider && !isMaintainer && isFunding) {
      listOrders({ userId: data.id })
    }
  }, [completed, isContributor, isProvider, isMaintainer, isFunding, data.id])

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
    completed && dashboard.completed && tasks.completed && projects.completed && transfers.completed

  const allFundingCompleted = completed && dashboard.completed && orders.completed

  return (
    <Container>
      {!isContributor && !isProvider && !isMaintainer && !isFunding && (
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
      {isContributor ? (
        <ContributorDashboard
          completed={allCompleted}
          banner={
            <AccountRequirements user={data} account={account} onClick={handleGoToPayoutSettings} />
          }
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
      ) : isProvider ? (
        <ServiceProviderDashboard
          completed={allProviderCompleted}
          banner={
            <AccountRequirements user={data} account={account} onClick={handleGoToPayoutSettings} />
          }
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
      ) : isMaintainer ? (
        <MaintainerDashboard
          completed={allMaintainerCompleted}
          stats={mapMaintainerStats(dashboard.data, projects.data)}
          openIssues={mapOpenIssues(tasks.data)}
          closedIssues={mapClosedIssues(tasks.data)}
          recentPayments={mapMaintainerPayments(transfers.data)}
          wallet={mapWalletSection(dashboard.data)}
          {...mapMaintainerChecklist({ user: data, dashboardData: dashboard.data })}
          onFundIssueClick={handleGoToExplore}
          onViewOpenIssuesClick={() => history.push('/profile/tasks/createdbyme')}
          onViewClosedIssuesClick={() => history.push('/profile/tasks/createdbyme')}
          onViewPaymentsClick={() => history.push('/profile/payments')}
          onManageWalletClick={() => history.push('/profile/wallets')}
        />
      ) : isFunding ? (
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
      ) : (
        <DashboardCardList user={user} dashboard={dashboard} />
      )}
    </Container>
  )
}

export default Dashboard
