/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'

import {
  Grid,
  Container,
  Button,
  withStyles,
  AppBar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'

import PaymentsContainer from '../../containers/payments'
import Bottom from '../bottom/bottom'
import ProfileOptions from './profile-options'
import UserTasksContainer from '../../containers/user-tasks'
import TransfersContainer from '../../containers/transfers'
import PayoutsContainer from '../../containers/payouts'
import { UserAccount } from './pages/user-account'

import { Page, PageContent } from 'app/styleguide/components/Page'

import PreferencesBar from './preferences-bar'
import UserOganizationTree from '../../containers/user-organization-tree'
import AccountHeader from './components/account-header'
import ProfileSideBar from './profile-sidebar'
import TaskContainer from '../../containers/task'
import TaskListProfile from '../../containers/task-list-profile'

const TaskListProfileProjects = TaskListProfile
const TaskListProfileOrganization = TaskListProfile

const styles = theme => ({
  root: {
    backgroundColor: '#F7F7F7',
  },
  altButton: {
    marginRight: 10
  },
  bigRow: {
    marginTop: 20,
    marginBottom: 20
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  rowList: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  rowContent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  infoItem: {
    width: '100%',
    textAlign: 'center'
  },
  menuContainer: {
    marginBottom: 40,
    marginRight: 20,
    marginLeft: 20,
    width: '100%'
  },
  menuItem: {
    /*
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      '& $primary, & $icon': {
        color: theme.palette.primary.main
      }
    }
    */
  },
  primary: {
    color: theme.palette.primary.contrastText
  },
  icon: {
    marginRight: 5,
    color: theme.palette.primary.contrastText
  },
  secondaryBar: {
    backgroundColor: theme.palette.primary.light
  },
  chip: {
    marginRight: 10,
    marginBottom: 20
  },
  chipSkill: {
    margin: theme.spacing(1),
  },
  chipLanguage: {
    margin: theme.spacing(1),
  },
  chipContainer: {
    marginTop: 12,
    marginBottom: 12,
    width: '100%'
  },
  sidePaper: {
    backgroundColor: '#2c5c46'
  },
  profile: {
    '& .profile-image': {
      width: 80,
      height: 80,
      objectFit: 'cover',
      maxWitdh: '100%',
      borderRadius: '50%',
      marginBottom: 8,
      border: '4px solid white',
    },
    '& .name': {
      textAlign: 'center',
      color: theme.palette.primary.dark,
      fontSize: '1.2rem',
    },
    '& .website': {
      textAlign: 'center',
      color: '#515bc4',
      fontSize: '0.8rem',
    },
    '& .details': {
      textAlign: 'center',
      marginTop: 10,
      padding: '12px 0 5px 0',
      backgroundColor: '#4D7E6F',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .details-mid': {
      textAlign: 'center',
      marginTop: 10,
      padding: '12px 0 5px 0',
      backgroundColor: '#4D7E6F',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .num': {
      color: '#eee',
      fontSize: '1.5rem',
    },
    '& .buttons': {
      background: 'transparent',
      width: '220px',
      height: '50px',
      textTransform: 'none',
      marginTop: '25px',
      borderRadius: 0,
      justifyContent: 'center',
      border: '2px solid white',
      color: 'white',
    },
    '& .buttons-disabled': {
      background: 'transparent',
      width: '220px',
      height: '50px',
      textTransform: 'none',
      marginTop: '25px',
      borderRadius: 0,
      justifyContent: 'center',
      border: '2px solid #999',
      color: '#999',
    },
    '& .icon': {
      height: '25px',
      width: '25px',
      marginLeft: 15,
    },
  }
})

class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: null,
      orgsLoaded: false,
      openUpdateProfileDialog: false,
      emailNotVerifiedDialog: false
    }
  }

  
  async componentDidMount () {
    await this.props.fetchOrganizations()
    this.setState({ orgsLoaded: true })
    if (this.props.user.Types && !this.props.user.Types.length) this.setState({ openUpdateProfileDialog: true })
    if (!this.props.user.provider && !this.props.user.email_verified) this.setState({ emailNotVerifiedDialog: true })
  }



  setActive (path) {
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
      default:
        this.setState({ selected: null })
        break
    }
  }

  getTitleNavigation = () => {
    switch (this.state.selected) {
      case 0:
        return (<FormattedMessage id='account.profile.issues.setup' defaultMessage='Issues' />)
      case 1:
        return (<FormattedMessage id='account.profile.payment.setup' defaultMessage='Setup payment' />)
      case 2:
        return (<FormattedMessage id='account.profile.preferences' defaultMessage='Preferences' />)
      case 3:
        return (<FormattedMessage id='account.profile.settings' defaultMessage='Settings' />)
      case 4:
        return (<FormattedMessage id='account.profile.roles' defaultMessage='Roles' />)
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

  render () {
    const { classes, user, roles } = this.props
    const { emailNotVerifiedDialog } = this.state

    let titleNavigation = this.getTitleNavigation()

    return (
      <Page>
        <Dialog open={ emailNotVerifiedDialog }>
          <DialogTitle>
            <FormattedMessage
              id='account.profile.email.verification'
              defaultMessage='Please check your e-mail'
            />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage
                id='account.profile.email.verification.message'
                defaultMessage='Please check your email inbox to validate your account to proceed'
              />
            </DialogContentText>
            <DialogContentText>
              <FormattedMessage
                id='account.profile.email.verification.message2'
                defaultMessage='If you have not received the email, please check your spam folder'
              />
            </DialogContentText>
            <DialogContentText>
              <FormattedMessage
                id='account.profile.email.verification.message3'
                defaultMessage='If you have not received the email, please click here to resend'
              />
            </DialogContentText>
            <DialogActions>
              <Button onClick={ (e) => this.handlingResendActivationEmail(e, user.id) } color='primary'>
                <FormattedMessage id='user.email.resend.link.label' defaultMessage='Resend verification link to your email' />
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <AppBar
          component='div'
          classes={ { colorPrimary: classes.secondaryBar } }
          color='primary'
          position='static'
          elevation={ 0 } />
        { this.state.selected === 2 &&
          <PreferencesBar classes={ classes } />
        }
        <PageContent>
          <Grid container className={ classes.root } spacing={ 0 }>
            { user &&
              <ProfileSideBar
                classes={ classes }
                user={ user }
                onLogout={ this.handleSignOut }
                history={ this.props.history }
              />
            }
            <Grid item xs={ 12 } md={ 10 }>
              <AccountHeader
                classes={ classes }
                user={ user }
                onCreateTask={ this.props.createTask }
                history={ this.props.history }
                onLogout={ this.handleSignOut }
              />
              <Container maxWidth='lg'>
                <HashRouter>
                  <Switch>
                    <Route exact path='/profile' component={
                      (props) =>
                        (<ProfileOptions
                          { ...props }
                          user={ this.props.user }
                          onCreateTask={ this.props.createTask }
                          intl={ this.props.intl }
                          updateUser={ this.props.updateUser }
                          roles={ roles }
                          updateRoles={ this.props.updateRoles }
                          fetchRoles={ this.props.fetchRoles }
                          createRoles={ this.props.createRoles }
                          deleteRoles={ this.props.deleteRoles }
                          addNotification={ this.props.addNotification }
                          visible={ this.state.openUpdateProfileDialog }
                          onClose={ () => this.setState({ openUpdateProfileDialog: false }) }
                        />)
                    } />
                    <Route path='/profile/user-account' component={
                      (props) =>
                        (<UserAccount
                          user={ this.props.user }
                          updateUser={ this.props.updateUser }
                          addNotification={ this.props.addNotification }
                          history={ this.props.history }
                          deleteUser={ this.props.deleteUser }
                        />)
                    }
                    />
                    { this.props.user.Types && this.props.user.Types.map(t => t.name).includes('maintainer') &&
                      <Route
                        exact
                        path='/profile/user/orgs'
                        component={ (props) => (<UserOganizationTree { ...props }
                          createOrganizations={ this.props.createOrganizations }
                          updateOrganization={ this.props.updateOrganization }
                          organizations={ this.props.organizations }
                          history={ this.props.history }
                        />) }
                      />
                    }
                    { (this.props.user.Types && this.props.user.Types.map(t => t.name).includes('contributor') ||
                      this.props.user.Types && this.props.user.Types.map(t => t.name).includes('maintainer')) &&
                      <Route
                        exact
                        path='/profile/tasks'
                        component={ UserTasksContainer }
                      />
                    }
                    { (this.props.user.Types && this.props.user.Types.map(t => t.name).includes('contributor') ||
                      this.props.user.Types && this.props.user.Types.map(t => t.name).includes('maintainer')) &&
                      <Route
                        exact
                        path='/profile/tasks/:filter'
                        component={ UserTasksContainer }
                      />

                    }
                    { (this.props.user.Types && this.props.user.Types.map(t => t.name).includes('maintainer') ||
                      this.props.user.Types && this.props.user.Types.map(t => t.name).includes('funding')) &&
                      <Route
                        exact
                        path='/profile/payments'
                        component={ PaymentsContainer }
                      />
                    }
                    { (this.props.user.Types && this.props.user.Types.map(t => t.name).includes('maintainer') ||
                      this.props.user.Types && this.props.user.Types.map(t => t.name).includes('contributor')) &&
                      <Route
                        exact
                        path='/profile/transfers'
                        component={ TransfersContainer }
                      />
                    }
                    { (this.props.user.Types && this.props.user.Types.map(t => t.name).includes('contributor')) &&
                      <Route
                        exact
                        path='/profile/payouts'
                        component={ PayoutsContainer }
                      />
                    }
                    <Route
                      exact
                      path='/profile/task/:id'
                      component={ (props) => <TaskContainer noTopBar noBottomBar { ...props } /> }
                    />
                    <Route
                      exact
                      path='/profile/task/:id/:slug'
                      component={ (props) => <TaskContainer noTopBar noBottomBar { ...props } /> }
                    />
                    <Route
                      exact
                      path='/profile/organizations/:organization_id'
                    >
                      <TaskListProfileOrganization noTopBar noBottomBar />
                    </Route>
                    <Route
                      exact
                      path='/profile/organizations/:organization_id/projects/:project_id'
                    >
                      <TaskListProfileProjects noTopBar noBottomBar />
                    </Route>
                    <Route
                      exact
                      path='/profile/organizations/:organization_id/projects/:project_id/:filter'
                    >
                      <TaskListProfileProjects noTopBar noBottomBar />
                    </Route>
                  </Switch>
                </HashRouter>
              </Container>
            </Grid>
          </Grid>
        </PageContent>
        { /* Uncomment the below section to enable the 'Your Organizations section' */ }
        { /* { this.state.orgsLoaded && organizations &&
            <Grid item xs={ 12 } md={ 12 }>
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
          } */ }
        <Bottom classes={ classes } />
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

export default injectIntl(withStyles(styles)(Profile))
