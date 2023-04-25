/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import logo from '../../images/gitpay-logo.png'

import {
  Logo,
  StyledButton
} from '../topbar/TopbarStyles'

import {
  Grid,
  Chip,
  Container,
  Avatar,
  Typography,
  Button,
  Paper,
  ListItemIcon,
  ListItemText,
  MenuList,
  MenuItem,
  withStyles,
  Toolbar,
  AppBar,
} from '@material-ui/core'
import {
  LibraryBooks,
  Home,
  Tune,
  Person,
  Web,
  ArrowBack,
  Settings,
  FaceSharp,
  Business,
  AccountBalance,
  AccountBox,
  ExitToApp,
  Payment as PaymentIcon
} from '@material-ui/icons'

import classNames from 'classnames'
import nameInitials from 'name-initials'

import api from '../../consts'

import TopBarContainer from '../../containers/topbar'
import PaymentsContainer from '../../containers/payments'
import Bottom from '../bottom/bottom'
import ProfileOptions from './profile-options'
import UserTasksContainer from '../../containers/user-tasks'
import PaymentOptions from '../payment/payment-options'
import Preferences from './preferences'
import Roles from './user-roles'
import SettingsComponent from './settings'
import UpdateRole from './update-role'

import { Page, PageContent } from 'app/styleguide/components/Page'

import PreferencesBar from './preferences-bar'
import UserOganizationTree from '../../containers/user-organization-tree'
import AccountDetails from '../../containers/account-details'

import logoGithub from '../../images/github-logo.png'
import logoBitbucket from '../../images/bitbucket-logo.png'

const styles = theme => ({
  root: {
    flexGrow: 1,
    flexFlow: 'wrap',
    justifyContent: 'center',
    width: 'calc(100%)'
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
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white
      }
    }
  },
  primary: {},
  icon: {
    marginRight: 5
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
  paper: {
    // backgroundColor: '#0b0d21',
    backgroundColor: '#F9F9F9',
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
      openUpdateProfileDialog: false
    }
  }

  async componentDidMount () {
    await this.props.fetchOrganizations()
    this.setState({ orgsLoaded: true })
    if (this.props.user.Types && !this.props.user.Types.length) this.setState({ openUpdateProfileDialog: true })
  }

  setActive (path) {
    switch (path) {
      case '/profile':
        this.setState({ selected: 0 })
        break
      case '/profile/account-details':
        this.setState({ selected: 1 })
        break
      case '/profile/payment-options':
        this.setState({ selected: 2 })
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
      case '/profile/roles':
        this.setState({ selected: 7 })
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

  render () {
    const { classes, user, preferences, roles } = this.props
    const userTypes = user.Types && user.Types.map(t => t.name)

    let titleNavigation = this.getTitleNavigation()

    return (
      <Page>

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
            <Grid item xs={ 12 } md={ 2 } spacing={ 0 } style={ { backgroundColor: '#F9F9F9' } }>
              <div>
                <div className={ classes.paper }>
                  <div className={ classes.profile }>
                    <div style={ { display: 'flex', justifyContent: 'center', padding: 20 } }>
                      <StyledButton href='/'>
                        <Logo src={ logo } />
                      </StyledButton>
                    </div>
                    <div className={ classes.row }>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        padding: 20,
                        height: '100vh'
                      }}>
                        <MenuList>
                          <MenuItem
                            onClick={ () =>
                              this.props.history.push('/profile')
                            }
                            className={ classes.menuItem }
                            selected={ this.state.selected === 0 }
                          >
                            <ListItemIcon className={ classes.icon }>
                              <Home />
                            </ListItemIcon>
                            <ListItemText
                              classes={ { primary: classes.primary } }
                              primary={
                                <span>
                                  <FormattedMessage
                                    id='account.profile.home.link.label'
                                    defaultMessage='Dashboard'
                                  />
                                </span>
                              }
                            />
                          </MenuItem>
                          { userTypes && (userTypes.includes('contributor') || userTypes.includes('maintainer')) &&
                            <MenuItem
                              onClick={ (e) => this.props.history.push('/profile/tasks') }
                              className={ classes.menuItem }
                              selected={ this.state.selected === 4 }
                            >
                              <ListItemIcon className={ classes.icon }>
                                <LibraryBooks />
                              </ListItemIcon>
                              <ListItemText
                                classes={ { primary: classes.primary } }
                                primary={
                                  <span>
                                    <FormattedMessage
                                      id='account.profile.issues.setup'
                                      defaultMessage='Issues'
                                    />
                                  </span>
                                }
                              />
                            </MenuItem>
                          }
                          { this.props.user.Types && this.props.user.Types.map(t => t.name).includes('maintainer') &&
                            <MenuItem
                              onClick={ () =>
                                this.props.history.push('/profile/user/orgs')
                              }
                              className={ classes.menuItem }
                              selected={ this.state.selected === 3 }
                            >
                              <ListItemIcon className={ classes.icon }>
                                <Business />
                              </ListItemIcon>
                              <ListItemText
                                classes={ { primary: classes.primary } }
                                primary={
                                  <span>
                                    <FormattedMessage
                                      id='account.profile.organization.maintainer'
                                      defaultMessage='Organizations'
                                    />
                                  </span>
                                }
                              />
                            </MenuItem>
                          } 
                          { this.props.user.Types && (this.props.user.Types.map(t => t.name).includes('funding') || this.props.user.Types.map(t => t.name).includes('maintainer')) &&
                            <MenuItem
                              onClick={ () =>
                                this.props.history.push('/profile/payments')
                              }
                              className={ classes.menuItem }
                              selected={ this.state.selected === 5 }
                            >
                              <ListItemIcon className={ classes.icon }>
                                <PaymentIcon />
                              </ListItemIcon>
                              <ListItemText
                                classes={ { primary: classes.primary } }
                                primary={
                                  <span>
                                    <FormattedMessage
                                      id='account.profile.payments.list'
                                      defaultMessage='Payments'
                                    />
                                  </span>
                                }
                              />
                            </MenuItem>
                          }
                          <MenuItem
                            onClick={ () =>
                              this.props.history.push('/profile/account-details')
                            }
                            className={ classes.menuItem }
                            selected={ this.state.selected === 1 }
                          >
                            <ListItemIcon className={ classes.icon }>
                              <AccountBox />
                            </ListItemIcon>
                            <ListItemText
                              classes={ { primary: classes.primary } }
                              primary={
                                <span>
                                  <FormattedMessage
                                    id='account.profile.account.link.label'
                                    defaultMessage='Account'
                                  />
                                </span>
                              }
                            />
                          </MenuItem>
                          { this.props.user.Types && this.props.user.Types.map(t => t.name).includes('contributor') &&
                            <MenuItem
                              onClick={ () =>
                                this.props.history.push('/profile/payment-options')
                              }
                              className={ classes.menuItem }
                              selected={ this.state.selected === 2 }
                            >
                              <ListItemIcon className={ classes.icon }>
                                <AccountBalance />
                              </ListItemIcon>
                              <ListItemText
                                classes={ { primary: classes.primary } }
                                primary={
                                  <span>
                                    <FormattedMessage
                                      id='account.profile.bank.setup'
                                      defaultMessage='Bank account'
                                    />
                                  </span>
                                }
                              />
                            </MenuItem>
                          }

                          <MenuItem
                            onClick={ () =>
                              this.props.history.push('/profile/preferences')
                            }
                            className={ classes.menuItem }
                            selected={ this.state.selected === 6 }
                          >
                            <ListItemIcon className={ classes.icon }>
                              <Tune />
                            </ListItemIcon>
                            <ListItemText
                              classes={ { primary: classes.primary } }
                              primary={
                                <span>
                                  <FormattedMessage
                                    id='account.profile.skills'
                                    defaultMessage='Skills'
                                  />
                                </span>
                              }
                            />
                          </MenuItem>
                          <MenuItem
                            onClick={ () =>
                              this.props.history.push('/profile/settings')
                            }
                            className={ classes.menuItem }
                            selected={ this.state.selected === 7 }
                          >
                            <ListItemIcon className={ classes.icon }>
                              <Settings />
                            </ListItemIcon>
                            <ListItemText
                              classes={ { primary: classes.primary } }
                              primary={
                                <span>
                                  <FormattedMessage
                                    id='account.profile.settings'
                                    defaultMessage='Settings'
                                  />
                                </span>
                              }
                            />
                          </MenuItem>
                          <MenuItem
                            onClick={ () => this.props.history.push('/profile/roles') }
                            className={ classes.menuItem }
                            selected={ this.state.selected === 8 }
                          >
                            <ListItemIcon className={ classes.icon }>
                              <FaceSharp />
                            </ListItemIcon>
                            <ListItemText
                              classes={ { primary: classes.primary } }
                              primary={
                                <span>
                                  <FormattedMessage id='account.profile.roles' defaultMessage='Roles' />
                                </span>
                              }
                            />
                          </MenuItem>
                        </MenuList>
                        <MenuList style={{marginTop: 'auto'}}>
                          <MenuItem button onClick={ this.handleSignOut }>
                            <ListItemIcon>
                              <ExitToApp />
                            </ListItemIcon>
                            <ListItemText>
                              <FormattedMessage id='task.actions.account.logout' defaultMessage='Logout' />
                            </ListItemText>
                          </MenuItem>
                        </MenuList>
                      </div>
                    </div>
                    { false &&
                      <Grid
                        container
                        direction='column'
                        justify='center'
                        alignItems='center'
                        className={ classes.rowList }
                      >
                        <Grid item className={ classNames(classes.rowContent) }>
                          <Button
                            disabled={ user.provider === 'github' }
                            href={ `${api.API_URL}/authorize/github` }
                            variant='outlined'
                            size='medium'
                            className={
                              user.provider === 'github'
                                ? 'buttons-disabled'
                                : 'buttons'
                            }
                          >
                            Connect to Github
                            <img width='16' src={ logoGithub } className='icon' />
                          </Button>
                        </Grid>
                        <Grid item className={ classNames(classes.rowContent) }>
                          <Button
                            disabled={ user.provider === 'bitbucket' }
                            href={ `${api.API_URL}/authorize/bitbucket` }
                            variant='contained'
                            size='medium'
                            className={
                              user.provider === 'bitbucket'
                                ? 'buttons-disabled'
                                : 'buttons'
                            }
                          >
                            Connect to Bitbucket
                            <img
                              width='16'
                              src={ logoBitbucket }
                              className='icon'
                            />
                          </Button>
                        </Grid>
                      </Grid> }
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={ 12 } md={ 10 }>
              <Container maxWidth='lg'>
                <HashRouter>
                  <Switch>
                    <Route exact path='/profile' component={ (props) => <ProfileOptions { ...props } user={ this.props.user } /> } />
                    <Route exact path='/profile/account-details' component={ (props) => <AccountDetails { ...props } user={ this.props.user } /> } />
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
                    { this.props.user.Types && this.props.user.Types.map(t => t.name).includes('contributor') &&
                      <Route
                        exact
                        path='/profile/payment-options'
                        component={ () => <PaymentOptions user={ user } /> }
                      />
                    }
                    { this.props.user.Types && this.props.user.Types.map(t => t.name).includes('contributor') &&
                      <Route
                        exact
                        path='/profile/preferences'
                        component={ () => <Preferences user={ user } preferences={ preferences } classes={ classes } updateUser={ this.props.updateUser } fetchPreferences={ this.props.fetchPreferences } /> }
                      />
                    }
                    <Route
                      exact
                      path='/profile/settings'
                      component={ () => <SettingsComponent updateUser={ this.props.updateUser } classes={ classes } user={ this.props.user } /> }
                    />
                    <Route
                      exact
                      path='/profile/roles'
                      component={ () => <Roles intl={ this.props.intl } updateUser={ this.props.updateUser } user={ user } roles={ roles } updateRoles={ this.props.updateRoles } fetchRoles={ this.props.fetchRoles } createRoles={ this.props.createRoles } deleteRoles={ this.props.deleteRoles } addNotification={ this.props.addNotification } /> }
                    />
                  </Switch>
                </HashRouter>
                <UpdateRole
                  intl={ this.props.intl }
                  updateUser={ this.props.updateUser }
                  user={ user }
                  roles={ roles }
                  updateRoles={ this.props.updateRoles }
                  fetchRoles={ this.props.fetchRoles }
                  createRoles={ this.props.createRoles }
                  deleteRoles={ this.props.deleteRoles }
                  addNotification={ this.props.addNotification }
                  visible={ this.state.openUpdateProfileDialog }
                  onClose={ () => this.setState({ openUpdateProfileDialog: false }) }
                />
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
