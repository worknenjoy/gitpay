import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'

import { Typography, Button, CardContent } from '@mui/material'

import { Alert, AlertTitle } from '@mui/material'

import { Card, CardList, CardMedia } from '../../components/ProfileStyles'
import { CardActionsCentered, ContentWrapper, AlertWrapper } from './profile-options.styles'
import WelcomeUser from '../../components/session/welcome-user'

// Use ES module imports for assets so webpack (file-loader) returns a URL string correctly
import toolsIcon from 'images/icons/noun_project management_3063515.svg'
import preferencesIcon from 'images/icons/noun_project management_3063532.svg'
import generalSettingsIcon from 'images/icons/noun_project management_3063521.svg'
import taskIcon from 'images/icons/noun_project management_3063547.svg'
import configIcon from 'images/icons/noun_project management_3063514.svg'
import paymentsIcon from 'images/icons/noun_project management_3063535.svg'

// styles moved to styled components in profile-options.styles.ts

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
      <ContentWrapper>
        <CardList>
          {Types && Types.map((t) => t.name).includes('contributor') && (
            <Card>
              <FormattedMessage id="account.profile.issues.caption" defaultMessage="Issues">
                {(msg) => <CardMedia image={taskIcon} title={msg} />}
              </FormattedMessage>
              <CardContent>
                <Typography variant="h6">
                  <FormattedMessage id="account.profile.issues.headline" defaultMessage="Issues" />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage
                    id="account.profile.issues.description"
                    defaultMessage="Check the issues available for you"
                  />
                </Typography>
              </CardContent>
              <CardActionsCentered>
                <Button size="small" color="primary">
                  <Link to={'/profile/tasks'}>
                    <FormattedMessage
                      id="account.profile.issues.link.tasks"
                      defaultMessage="See issues"
                    />
                  </Link>
                </Button>
              </CardActionsCentered>
            </Card>
          )}
          {Types &&
            (Types.map((t) => t.name).includes('funding') ||
              Types.map((t) => t.name).includes('maintainer')) && (
              <Card>
                <FormattedMessage
                  id="account.profile.tasks.payments.caption"
                  defaultMessage="Payments"
                >
                  {(msg) => <CardMedia image={paymentsIcon} title={msg} />}
                </FormattedMessage>
                <CardContent>
                  <Typography variant="h6">
                    <FormattedMessage
                      id="account.profile.tasks.payment.paid.headline"
                      defaultMessage="Payments"
                    />
                  </Typography>
                  <Typography variant="body2">
                    <FormattedMessage
                      id="account.profile.tasks.payments.desc"
                      defaultMessage="Access all your payments to any issue on Gitpay"
                    />
                  </Typography>
                </CardContent>
                <CardActionsCentered>
                  <Button size="small" color="primary">
                    <Link to={'/profile/payments'}>
                      <FormattedMessage
                        id="account.profile.payments.setup"
                        defaultMessage="See your payments"
                      />
                    </Link>
                  </Button>
                </CardActionsCentered>
              </Card>
            )}
          {Types && Types.map((t) => t.name).includes('contributor') && (
            <Card>
              <FormattedMessage id="account.profile.tasks.payment.caption" defaultMessage="Payment">
                {(msg) => <CardMedia image={toolsIcon} title={msg} />}
              </FormattedMessage>
              <CardContent>
                <Typography variant="h6">
                  <FormattedMessage
                    id="account.profile.tasks.paid.headline"
                    defaultMessage="Bank account"
                  />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage
                    id="account.profile.tasks.bank.desc"
                    defaultMessage="Register your bank accounts"
                  />
                </Typography>
              </CardContent>
              <CardActionsCentered>
                <Button size="small" color="primary">
                  <Link to={'/profile/payout-settings'}>
                    <FormattedMessage
                      id="account.profile.tasks.account.setup"
                      defaultMessage="Setup bank account"
                    />
                  </Link>
                </Button>
              </CardActionsCentered>
            </Card>
          )}
          {Types && Types.map((t) => t.name).includes('contributor') && (
            <Card>
              <CardMedia image={preferencesIcon} title="Contemplative Reptile" />
              <CardContent>
                <Typography variant="h6">
                  <FormattedMessage
                    id="account.profile.preferences.headline"
                    defaultMessage="Preferences"
                  />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage
                    id="account.profile.preferences.description"
                    defaultMessage="Setup your preferences to receive matching offers"
                  />
                </Typography>
              </CardContent>
              <CardActionsCentered>
                <Button size="small" color="primary">
                  <Link to="/profile/user-account/skills">
                    <FormattedMessage
                      id="account.profile.preferences.link"
                      defaultMessage="Setup preferences"
                    />
                  </Link>
                </Button>
              </CardActionsCentered>
            </Card>
          )}
          <Card>
            <CardMedia image={configIcon} title="Contemplative Reptile" />
            <CardContent>
              <Typography variant="h6">
                <FormattedMessage id="account.profile.roles.headline" defaultMessage="Roles" />
              </Typography>
              <Typography variant="body2">
                <FormattedMessage
                  id="account.profile.roles.description"
                  defaultMessage="Set your roles to define your capabilities on Gitpay"
                />
              </Typography>
            </CardContent>
            <CardActionsCentered>
              <Button size="small" color="primary">
                <Link to="/profile/user-account/roles">
                  <FormattedMessage
                    id="account.profile.roles.link"
                    defaultMessage="Setup your roles on Gitpay"
                  />
                </Link>
              </Button>
            </CardActionsCentered>
          </Card>
          <Card>
            <CardMedia image={generalSettingsIcon} title="General settings" />
            <CardContent>
              <Typography variant="h6">
                <FormattedMessage
                  id="account.profile.settings.headline"
                  defaultMessage="General settings"
                />
              </Typography>
              <Typography variant="body2">
                <FormattedMessage
                  id="account.profile.settings.description"
                  defaultMessage="Set your general settings on Gitpay to setups your account"
                />
              </Typography>
            </CardContent>
            <CardActionsCentered>
              <Button size="small" color="primary">
                <Link to="/profile/user-account/settings">
                  <FormattedMessage
                    id="account.profile.settings.link"
                    defaultMessage="Your general settings"
                  />
                </Link>
              </Button>
            </CardActionsCentered>
          </Card>
        </CardList>
      </ContentWrapper>
    </Fragment>
  )
}

export default ProfileOptions
