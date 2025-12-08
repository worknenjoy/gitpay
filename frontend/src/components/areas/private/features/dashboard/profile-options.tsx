import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import { Typography, Button, CardContent } from '@mui/material'
import { Alert, AlertTitle } from '@mui/material'
import { 
  CardActionsCentered,
  ContentWrapper,
  AlertWrapper,
  Card,
  CardList,
  CardMedia 
} from './profile-options.styles'
import WelcomeUser from '../../components/session/welcome-user'
import toolsIcon from 'images/icons/noun_project management_3063515.svg'
import preferencesIcon from 'images/icons/noun_project management_3063532.svg'
import generalSettingsIcon from 'images/icons/noun_project management_3063521.svg'
import taskIcon from 'images/icons/noun_project management_3063547.svg'
import configIcon from 'images/icons/noun_project management_3063514.svg'
import paymentsIcon from 'images/icons/noun_project management_3063535.svg'
import DashboardCardList from 'design-library/molecules/cards/dashboard-cards/dashboard-card-list/dashboard-card-list'

const ProfileOptions = ({ user }) => {
  const { data = {}, completed } = user
  const { Types = [] } = data

  const history = useHistory()

  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    Types.length === 0 && setVisible(true)
  }, [Types])

  return (
    <Fragment>
      {window.localStorage.getItem('firstLogin') === 'true' && <WelcomeUser />}
      {visible && completed && (
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
      <DashboardCardList 
        user={user}
        info={{
          completed: true,
          data: {
            activeIssues: 0,
            closedIssues: 0,
          }
        }}
      />
    </Fragment>
  )
}

export default ProfileOptions
