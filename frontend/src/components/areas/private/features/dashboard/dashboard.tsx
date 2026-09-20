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

const Dashboard = ({
  user,
  dashboard,
  account,
  tasks,
  taskSolutions,
  payouts,
  fetchDashboardInfo,
  fetchAccount,
  listTasks,
  listTaskSolutions,
  searchPayout,
  addNotification
}) => {
  const { data = {}, completed } = user
  const { isContributor } = useUserTypes({ user })

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

  const allCompleted =
    completed &&
    dashboard.completed &&
    account.completed &&
    tasks.completed &&
    taskSolutions.completed &&
    payouts.completed

  return (
    <Container>
      {!isContributor && (
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
      ) : (
        <DashboardCardList user={user} dashboard={dashboard} />
      )}
    </Container>
  )
}

export default Dashboard
