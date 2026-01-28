import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Container, Grid } from '@mui/material'
import { Alert, AlertTitle } from '@mui/material'
import { AlertWrapper } from './dashboard.styles'
import WelcomeUser from '../../components/session/welcome-user'
import DashboardCardList from 'design-library/molecules/cards/dashboard-cards/dashboard-card-list/dashboard-card-list'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'

const Dashboard = ({ user, dashboard, fetchDashboardInfo, addNotification }) => {
  const { data = {}, completed } = user

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

  return (
    <Container>
      <Grid container justifyContent="space-between" alignItems="center">
        <MainTitle title={<FormattedMessage id="dashboard.title" defaultMessage="Dashboard" />} />
      </Grid>
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
                  defaultMessage="Update your role"
                />
              </Button>
            }
          >
            <AlertTitle>
              <FormattedMessage
                id="account.profile.alert.title"
                defaultMessage="Update your role"
              />
            </AlertTitle>
            <FormattedMessage
              id="account.profile.alert.description"
              defaultMessage="You need to update your role to define your user type. Click on the button to update your role"
            />
          </Alert>
        </AlertWrapper>
      )}
      <DashboardCardList user={user} dashboard={dashboard} />
    </Container>
  )
}

export default Dashboard
