/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'

import {
  Grid,
  Chip,
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
  CreditCard,
  Tune,
  Person,
  ArrowBack,
  Settings,
  FaceSharp
} from '@material-ui/icons'

import classNames from 'classnames'
import nameInitials from 'name-initials'

import api from '../../consts'

import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'
import ProfileOptions from './profile-options'
import TaskListContainer from '../../containers/task-list'
import PaymentOptions from '../payment/payment-options'
import Preferences from './preferences'
import Roles from './user-roles'
import SettingsComponent from './settings'
import UpdateRole from './update-role'

import { Page, PageContent } from 'app/styleguide/components/Page'

import PreferencesBar from './preferences-bar'
import Tasks from './tasks'
import UserTasksListContainer from '../../containers/user-tasks'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

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
    marginTop: 10
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
    padding: '10px 0 30px 0',
    backgroundColor: '#0b0d21',
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
      color: '#eee',
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
      backgroundColor: 'rgba(47, 168, 233, 1)',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .details-mid': {
      textAlign: 'center',
      marginTop: 10,
      padding: '12px 0 5px 0',
      backgroundColor: 'rgba(21, 139, 203, 1)',
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

  componentWillMount () {
    this.setActive(this.props.location.pathname)
  }

  componentDidMount () {
    this.props.fetchOrganizations().then(org => {
      this.setState({ orgsLoaded: true })
      if (this.props.user.Types && !this.props.user.Types.length) this.setState({ openUpdateProfileDialog: true })
    })
  }

  setActive (path) {
    switch (path) {
      case '/profile/tasks':
        this.setState({ selected: 0 })
        break
      case '/profile/payment-options':
        this.setState({ selected: 1 })
        break
      case '/profile/preferences':
        this.setState({ selected: 2 })
        break
      case '/profile/settings':
        this.setState({ selected: 3 })
        break
      case '/profile/roles':
        this.setState({ selected: 4 })
        break
      default:
        this.setState({ selected: null })
        break
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setActive(nextProps.location.pathname)
    }
  }

  getTitleNavigation = () => {
    switch (this.state.selected) {
      case 0:
        return (<FormattedMessage id='account.profile.tasks.setup' defaultMessage='Tasks' />)
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
  render () {
    const { classes, user, preferences, roles } = this.props

    let titleNavigation = this.getTitleNavigation()

    return (
      <Page>
        <TopBarContainer />
        <AppBar
          component='div'
          classes={ { colorPrimary: classes.secondaryBar } }
          color='primary'
          position='static'
          elevation={ 0 }>
          <Toolbar>
            <Grid container alignItems='center' spacing={ 1 }>
              <Grid item xs>
                <Typography color='primary' variant='h6'>
                  <Button onClick={ this.handleBackToTaskList } variant='text' size='small' aria-label='Back' color='primary'>
                    <ArrowBack />
                  </Button>
                  <span style={ { marginLeft: 10 } }>
                    { titleNavigation }
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        { this.state.selected === 2 &&
          <PreferencesBar classes={ classes } />
        }
        <PageContent>
          <Grid container className={ classes.root } spacing={ 2 }>
            <Grid item xs={ 12 } md={ 8 }>
              <HashRouter>
                <Switch>
                  <Route exact path='/profile' component={ (props) => <ProfileOptions { ...props } user={ this.props.user } /> } />
                  { this.props.user.Types && this.props.user.Types.map(t => t.name).includes('maintainer') &&
                    <Route
                      exact
                      path='/profile/user/tasks'
                      component={ (props) => <UserTasksListContainer { ...props} 
                        createOrganizations={this.props.createOrganizations}
                        updateOrganization={this.props.updateOrganization}
                        organizations={this.props.organizations}
                        history={this.props.history} 
                      /> }
                    />
                  }
                  { this.props.user.Types && this.props.user.Types.map(t => t.name).includes('contributor') &&
                    <Route
                      exact
                      path='/profile/tasks'
                      component={ () => <TaskListContainer /> }
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
                    component={ () => <SettingsComponent deleteUser={ this.props.deleteUser } classes={ classes } user={ this.props.user } /> }
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
            </Grid>
            <Grid item xs={ 12 } md={ 4 }>
              <div className={ classes.bigRow }>
                <Paper className={ classes.paper }>
                  <div className={ classes.profile }>
                    <div className={ classes.row }>
                      { user.picture_url ? (
                        <Avatar
                          alt={ user.username }
                          src={ user.picture_url }
                          className={ classNames(
                            classes.avatar,
                            classes.bigAvatar,
                            'profile-image'
                          ) }
                        />
                      ) : (
                        <Avatar
                          alt={ user.username }
                          src=''
                          className={ classNames(
                            classes.avatar,
                            classes.bigAvatar,
                            'profile-image'
                          ) }
                        >
                          { user.name ? (
                            nameInitials(user.name)
                          ) : user.username ? (
                            nameInitials(user.username)
                          ) : (
                            <Person />
                          ) }
                        </Avatar>
                      ) }
                    </div>
                    <div className={ classes.infoItem }>
                      <Typography className='name'>{ user.name }</Typography>
                    </div>
                    <div className={ classes.infoItem }>
                      <Typography className='website'>
                        <a href={ user.website } target='__blank'>
                          { user.website &&
                            user.website.replace(/^https?:\/\//, '') }
                        </a>
                      </Typography>
                    </div>
                    <div style={{marginTop: 20, display: 'flex', justifyContent: 'center'}}>
                        { user && user.Types && user.Types.map(r => {
                          return (
                            <Chip
                              style={{marginRight: 10}}
                              label={ r.name }
                            />
                          )
                        })}
                    </div>
                    { this.props.user.Types && this.props.user.Types.map(t => t.name).includes('contributor') &&
                    <div className={ classes.rowList }>
                      <Grid
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                      >
                        <Grid item xs={ 4 }>
                          { user && (
                            <div className={ classes.infoItem }>
                              <Typography className='details'>
                                <span className='num'>
                                  { user.tasks ? user.tasks : 0 }
                                </span>
                                <br />
                                Tasks
                              </Typography>
                            </div>
                          ) }
                        </Grid>
                        <Grid item xs={ 4 }>
                          { user && (
                            <div className={ classes.infoItem }>
                              <Typography className='details-mid'>
                                <span className='num'>
                                  ${ user.bounties ? user.bounties : 0 }
                                </span>
                                <br />
                                Bounties
                              </Typography>
                            </div>
                          ) }
                        </Grid>
                        <Grid item xs={ 4 }>
                          { user && (
                            <div className={ classes.infoItem }>
                              <Typography className='details'>
                                <span className='num'>
                                  { user.repos ? user.repos : 0 }
                                </span>
                                <br />
                                Repositories
                              </Typography>
                            </div>
                          ) }
                        </Grid>
                      </Grid>
                    </div>
                    }
                    <div className={ classes.row }>
                    <Paper className={ classes.menuContainer } style={ { marginTop: 40, marginBottom: 20 } }>
                      <MenuList>
                      { this.props.user.Types && this.props.user.Types.map(t => t.name).includes('maintainer') &&
                        <MenuItem
                          onClick={ () =>
                            this.props.history.push('/profile/user/tasks')
                          }
                          className={ classes.menuItem }
                          selected={ this.state.selected === 0 }
                        >
                          <ListItemIcon className={ classes.icon }>
                            <LibraryBooks />
                          </ListItemIcon>
                          <ListItemText
                            classes={ { primary: classes.primary } }
                            primary={
                              <span>
                                <FormattedMessage
                                  id='account.profile.issues.maintainer'
                                  defaultMessage='Your issues'
                                />
                              </span>
                            }
                          />
                        </MenuItem>
                      }
                      { this.props.user.Types && this.props.user.Types.map(t => t.name).includes('contributor') &&
                        <MenuItem
                          onClick={ () =>
                            this.props.history.push('/profile/tasks')
                          }
                          className={ classes.menuItem }
                          selected={ this.state.selected === 0 }
                        >
                          <ListItemIcon className={ classes.icon }>
                            <LibraryBooks />
                          </ListItemIcon>
                          <ListItemText
                            classes={ { primary: classes.primary } }
                            primary={
                              <span>
                                <FormattedMessage
                                  id='account.profile.tasks.setup'
                                  defaultMessage='Tasks'
                                />
                              </span>
                            }
                          />
                        </MenuItem>
                        }
                        <MenuItem
                          onClick={ () =>
                            this.props.history.push('/profile/payment-options')
                          }
                          className={ classes.menuItem }
                          selected={ this.state.selected === 1 }
                        >
                          <ListItemIcon className={ classes.icon }>
                            <CreditCard />
                          </ListItemIcon>
                          <ListItemText
                            classes={ { primary: classes.primary } }
                            primary={
                              <span>
                                <FormattedMessage
                                  id='account.profile.payment.setup'
                                  defaultMessage='Setup payment'
                                />
                              </span>
                            }
                          />
                        </MenuItem>
                        <MenuItem
                          onClick={ () =>
                            this.props.history.push('/profile/preferences')
                          }
                          className={ classes.menuItem }
                          selected={ this.state.selected === 2 }
                        >
                          <ListItemIcon className={ classes.icon }>
                            <Tune />
                          </ListItemIcon>
                          <ListItemText
                            classes={ { primary: classes.primary } }
                            primary={
                              <span>
                                <FormattedMessage
                                  id='account.profile.preferences'
                                  defaultMessage='Preferences'
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
                          selected={ this.state.selected === 3 }
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
                          selected={ this.state.selected === 4 }
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
                    </Paper>
                  </div>
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
                    </Grid>
                  </div>
                </Paper>
              </div>
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
