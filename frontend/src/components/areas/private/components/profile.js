/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'

import {
  Grid,
  Container,
  Button,
  AppBar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import { styled } from '@mui/material/styles'

import { Page, PageContent } from '../../../../styleguide/components/Page'

import BottomContainer from '../../../../containers/bottom'
import ProfileOptions from '../features/dashboard/profile-options'

import UserTasksContainer from '../../../../containers/user-tasks'
import UserTasksExploreContainer from '../../../../containers/user-tasks-explore'
import PaymentsContainer from '../../../../containers/payments'
import WalletsContainer from '../../../../containers/wallets'
import TransfersContainer from '../../../../containers/transfers'
import PayoutsContainer from '../../../../containers/payouts'
import { UserAccount } from '../features/account/user-account'

import PreferencesBar from '../features/account/features/account-settings/preferences-bar'
import UserOganizationTree from '../../../../containers/user-organization-tree'
import AccountHeader from '../features/account/components/account-header'
import ProfileSideBar from './profile-sidebar'
import TaskContainer from '../../../../containers/task'
import TaskListProfile from '../../../../containers/task-list-profile'

const TaskListProfileProjects = (props) => <TaskListProfile {...props} />
const TaskListProfileOrganization = (props) => <TaskListProfile noTopBar noBottomBar {...props} />

const RootGrid = styled(Grid)(({ theme }) => ({ backgroundColor: '#F7F7F7' }))

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: null,
      orgsLoaded: false,
      openUpdateProfileDialog: false,
      emailNotVerifiedDialog: false
    }
  }

  async componentDidMount() {
    await this.props.fetchOrganizations()
    this.setState({ orgsLoaded: true })
    if (this.props.user.Types && !this.props.user.Types.length)
      this.setState({ openUpdateProfileDialog: true })
    if (!this.props.user.provider && !this.props.user.email_verified)
      this.setState({ emailNotVerifiedDialog: true })
  }

  setActive(path) {
    switch (path) {
      case '/profile':
        this.setState({ selected: 0 })
        break
      case '/profile/user/orgs':
        this.setState({ selected: 3 })
        break
      case '/profile/tasks':
        this.setState({ selected: 4 })
        break
      case '/profile/preferences':
        this.setState({ selected: 5 })
        break
      case '/profile/settings':
        this.setState({ selected: 6 })
        break
      case '/profile/payments':
        this.setState({ selected: 8 })
        break
      case '/profile/payments':
        this.setState({ selected: 9 })
        break
      default:
        this.setState({ selected: null })
        break
    }
  }

  getTitleNavigation = () => {
    switch (this.state.selected) {
      case 0:
        return <FormattedMessage id="account.profile.issues.setup" defaultMessage="Issues" />
      case 1:
        return (
          <FormattedMessage id="account.profile.payment.setup" defaultMessage="Setup payment" />
        )
      case 2:
        return <FormattedMessage id="account.profile.preferences" defaultMessage="Preferences" />
      case 3:
        return <FormattedMessage id="account.profile.settings" defaultMessage="Settings" />
      case 4:
        return <FormattedMessage id="account.profile.roles" defaultMessage="Roles" />
      default:
        return null
    }
  }

  handleBackToTaskList = () => {
    window.history.back()
  }

  handleSignOut = () => {
    this.props.history.replace({ pathname: '/' })
    this.props.signOut()
  }

  handlingResendActivationEmail = (e, userId) => {
    e.preventDefault()
    this.props.resendActivationEmail(userId)
  }

  render() {
    const { user, roles } = this.props
    const { emailNotVerifiedDialog } = this.state

    let titleNavigation = this.getTitleNavigation()

    return (
      <Page>
        <Dialog open={emailNotVerifiedDialog}>
          <DialogTitle>
            <FormattedMessage
              id="account.profile.email.verification"
              defaultMessage="Please check your e-mail"
            />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage
                id="account.profile.email.verification.message"
                defaultMessage="Please check your email inbox to validate your account to proceed"
              />
            </DialogContentText>
            <DialogContentText>
              <FormattedMessage
                id="account.profile.email.verification.message2"
                defaultMessage="If you have not received the email, please check your spam folder"
              />
            </DialogContentText>
            <DialogContentText>
              <FormattedMessage
                id="account.profile.email.verification.message3"
                defaultMessage="If you have not received the email, please click here to resend"
              />
            </DialogContentText>
            <DialogActions>
              <Button
                onClick={(e) => this.handlingResendActivationEmail(e, user.id)}
                color="primary"
              >
                <FormattedMessage
                  id="user.email.resend.link.label"
                  defaultMessage="Resend verification link to your email"
                />
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <AppBar
          component="div"
          color="primary"
          position="static"
          elevation={0}
          sx={{ bgcolor: (theme) => theme.palette.primary.light }}
        />
        {this.state.selected === 2 && <PreferencesBar />}
        <PageContent>
          <RootGrid container spacing={0}>
            {user && (
              <ProfileSideBar
                user={user}
                onLogout={this.handleSignOut}
                history={this.props.history}
              />
            )}
            <Grid size={{ xs: 12, md: 10 }}>
              <AccountHeader
                user={user}
                onCreateTask={this.props.createTask}
                history={this.props.history}
                onLogout={this.handleSignOut}
              />
              <Container maxWidth="lg">
                <HashRouter>
                  <Switch>
                    <Route
                      exact
                      path="/profile"
                      component={(props) => (
                        <ProfileOptions
                          {...props}
                          user={this.props.user}
                          onCreateTask={this.props.createTask}
                          intl={this.props.intl}
                          updateUser={this.props.updateUser}
                          roles={roles}
                          updateRoles={this.props.updateRoles}
                          fetchRoles={this.props.fetchRoles}
                          createRoles={this.props.createRoles}
                          deleteRoles={this.props.deleteRoles}
                          addNotification={this.props.addNotification}
                          visible={this.state.openUpdateProfileDialog}
                          onClose={() => this.setState({ openUpdateProfileDialog: false })}
                        />
                      )}
                    />
                    <Route
                      path="/profile/user-account"
                      component={(props) => (
                        <UserAccount
                          user={this.props.user}
                          updateUser={this.props.updateUser}
                          changePassword={this.props.changePassword}
                          addNotification={this.props.addNotification}
                          history={this.props.history}
                          deleteUser={this.props.deleteUser}
                        />
                      )}
                    />
                    {this.props.user.Types &&
                      this.props.user.Types.map((t) => t.name).includes('maintainer') && (
                        <Route
                          exact
                          path="/profile/user/orgs"
                          component={(props) => (
                            <UserOganizationTree
                              {...props}
                              createOrganizations={this.props.createOrganizations}
                              updateOrganization={this.props.updateOrganization}
                              organizations={this.props.organizations}
                              history={this.props.history}
                            />
                          )}
                        />
                      )}
                    {this.props.user.Types &&
                      (this.props.user.Types.map((t) => t.name).includes('contributor') ||
                        this.props.user.Types.map((t) => t.name).includes('funding')) && (
                        <Route
                          exact
                          path="/profile/explore"
                          component={UserTasksExploreContainer}
                        />
                      )}
                    {this.props.user.Types &&
                      (this.props.user.Types.map((t) => t.name).includes('contributor') ||
                        this.props.user.Types.map((t) => t.name).includes('funding')) && (
                        <Route
                          exact
                          path="/profile/explore/:filter"
                          component={UserTasksExploreContainer}
                        />
                      )}
                    {((this.props.user.Types &&
                      this.props.user.Types.map((t) => t.name).includes('contributor')) ||
                      (this.props.user.Types &&
                        this.props.user.Types.map((t) => t.name).includes('maintainer'))) && (
                      <Route exact path="/profile/tasks" component={UserTasksContainer} />
                    )}

                    {((this.props.user.Types &&
                      this.props.user.Types.map((t) => t.name).includes('contributor')) ||
                      (this.props.user.Types &&
                        this.props.user.Types.map((t) => t.name).includes('maintainer'))) && (
                      <Route exact path="/profile/tasks/:filter" component={UserTasksContainer} />
                    )}
                    {((this.props.user.Types &&
                      this.props.user.Types.map((t) => t.name).includes('maintainer')) ||
                      (this.props.user.Types &&
                        this.props.user.Types.map((t) => t.name).includes('funding'))) && (
                      <Route exact path="/profile/payments" component={PaymentsContainer} />
                    )}
                    {((this.props.user.Types &&
                      this.props.user.Types.map((t) => t.name).includes('maintainer')) ||
                      (this.props.user.Types &&
                        this.props.user.Types.map((t) => t.name).includes('funding'))) && (
                      <Route exact path="/profile/wallets" component={WalletsContainer} />
                    )}
                    {((this.props.user.Types &&
                      this.props.user.Types.map((t) => t.name).includes('maintainer')) ||
                      (this.props.user.Types &&
                        this.props.user.Types.map((t) => t.name).includes('contributor'))) && (
                      <Route exact path="/profile/transfers" component={TransfersContainer} />
                    )}
                    {((this.props.user.Types &&
                      this.props.user.Types.map((t) => t.name).includes('maintainer')) ||
                      (this.props.user.Types &&
                        this.props.user.Types.map((t) => t.name).includes('contributor'))) && (
                      <Route
                        exact
                        path="/profile/transfers/:transfer_id"
                        component={TransfersContainer}
                      />
                    )}
                    {this.props.user.Types &&
                      this.props.user.Types.map((t) => t.name).includes('contributor') && (
                        <Route exact path="/profile/payouts" component={PayoutsContainer} />
                      )}
                    <Route
                      exact
                      path={[
                        '/profile/task/:id',
                        '/profile/task/:id/:slug',
                        '/profile/explore/task/:id',
                        '/profile/explore/task/:id/:slug'
                      ]}
                      component={(props) => <TaskContainer noTopBar noBottomBar {...props} />}
                    />
                    <Route
                      exact
                      path="/profile/task/:id/offers"
                      component={(props) => <TaskContainer noTopBar noBottomBar {...props} />}
                    />
                    <Route
                      exact
                      path="/profile/task/:id/:slug/offers"
                      component={(props) => <TaskContainer noTopBar noBottomBar {...props} />}
                    />
                    <Route
                      exact
                      path={[
                        '/profile/organizations/:organization_id',
                        '/profile/organizations/:organization_id/:slug',
                        '/profile/explore/organizations/:organization_id',
                        '/profile/explore/organizations/:organization_id/:slug'
                      ]}
                      component={TaskListProfileOrganization}
                    />
                    <Route
                      exact
                      path={[
                        '/profile/organizations/:organization_id/projects/:project_id',
                        '/profile/organizations/:organization_id/projects/:project_id/:filter',
                        '/profile/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug',
                        '/profile/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug/:filter',
                        '/profile/organizations/:organization_id/projects/:project_id/:filter',
                        '/profile/explore/organizations/:organization_id/projects/:project_id',
                        '/profile/explore/organizations/:organization_id/projects/:project_id/:filter',
                        '/profile/explore/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug',
                        '/profile/explore/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug/:filter'
                      ]}
                    >
                      <TaskListProfileProjects noTopBar noBottomBar />
                    </Route>
                  </Switch>
                </HashRouter>
              </Container>
            </Grid>
          </RootGrid>
        </PageContent>
        {/* Uncomment the below section to enable the 'Your Organizations section' */}
        {/* { this.state.orgsLoaded && organizations &&
            <Grid size={{ xs: 12, md: 12 }}>
               <div style={ { marginTop: 10, marginBottom: 10 } }>
                <Typography variant='h5' component='h3'>
                  <FormattedMessage id='account.profile.org.headline' defaultMessage='Your organizations' />
                </Typography>
                <Typography component='p'>
                  <FormattedMessage id='account.profile.org.description' defaultMessage='Here is your organizations that you can import to Gitpay' />
                </Typography>
                <div style={ { marginTop: 20, marginBottom: 40 } }>
                  <Organizations user={ user } data={ organizations } onImport={ this.props.createOrganizations } />
                </div>
              </div>
            </Grid>
          } */}
        <BottomContainer />
      </Page>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object,
  user: PropTypes.object,
  history: PropTypes.object,
  roles: PropTypes.object,
  addNotification: PropTypes.object
}

export default injectIntl(Profile)
