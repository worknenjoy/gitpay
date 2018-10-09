import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, HashRouter } from 'react-router-dom'

import Grid from 'material-ui/Grid'
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import { ListItemIcon, ListItemText } from 'material-ui/List'
import { MenuList, MenuItem } from 'material-ui/Menu'
import DeviceHubIcon from 'material-ui-icons/DeviceHub'
import LibraryBooks from 'material-ui-icons/LibraryBooks'
import CreditCard from 'material-ui-icons/CreditCard'
import Tune from 'material-ui-icons/Tune'

import classNames from 'classnames'
import nameInitials from 'name-initials'
import { withStyles } from 'material-ui/styles'

import api from '../../consts'

import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'
import ProfileOptions from './profile-options'
import TaskListContainer from '../../containers/task-list'
import PaymentOptions from '../payment/payment-options'
import Preferences from '../../components/profile/preferences'

import { Page, PageContent } from 'app/styleguide/components/Page'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  altButton: {
    marginRight: 10
  },
  bigRow: {
    marginTop: 40
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
  }
})

class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: null
    }
  }

  componentWillMount () {
    this.setActive(this.props.location.pathname)
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

  render () {
    const { classes, user, preferences } = this.props

    return (
      <Page>
        <TopBarContainer />
        <PageContent>
          <Grid container className={ classes.root } spacing={ 24 }>
            <Grid item xs={ 12 } md={ 8 }>
              <HashRouter>
                <Switch>
                  <Route exact path='/profile' component={ ProfileOptions } />
                  <Route
                    exact
                    path='/profile/tasks'
                    component={ () => <TaskListContainer /> }
                  />
                  <Route
                    exact
                    path='/profile/payment-options'
                    component={ () => <PaymentOptions user={ user } /> }
                  />
                  <Route
                    exact
                    path='/profile/preferences'
                    component={ () => <Preferences user={ user } preferences={ preferences } /> }
                  />
                </Switch>
              </HashRouter>
            </Grid>
            <Grid item xs={ 12 } md={ 4 }>
              <div className={ classes.bigRow }>
                <div className={ classes.row }>
                  { user.picture_url ? (
                    <Avatar
                      alt={ user.username }
                      src={ user.picture_url }
                      className={ classNames(classes.avatar, classes.bigAvatar) }
                    />
                  ) : (
                    <Avatar
                      alt={ user.username }
                      src=''
                      className={ classNames(classes.avatar, classes.bigAvatar) }
                    >
                      { nameInitials(user.name || '') }
                    </Avatar>
                  ) }
                </div>
                <div className={ classes.rowList }>
                  <div className={ classes.rowContent }>
                    <Button
                      disabled={ user.provider === 'github' }
                      href={ `${api.API_URL}/authorize/github` }
                      variant='raised'
                      size='small'
                      color='secondary'
                      className={ classes.altButton }
                    >
                      <img width='16' src={ logoGithub } className={ classes.icon } />{ ' ' }
                      Github
                    </Button>
                    <Button
                      disabled={ user.provider === 'bitbucket' }
                      href={ `${api.API_URL}/authorize/bitbucket` }
                      variant='raised'
                      size='small'
                      color='secondary'
                      className={ classes.altButton }
                    >
                      <img
                        width='16'
                        src={ logoBitbucket }
                        className={ classes.icon }
                      />{ ' ' }
                      Bitbucket
                    </Button>
                  </div>
                </div>
                <div className={ classes.rowList }>
                  <div className={ classes.infoItem }>
                    <Typography>{ user.name }</Typography>
                  </div>
                  <div className={ classes.infoItem }>
                    <Typography>
                      <a href={ user.website }>{ user.website }</a>
                    </Typography>
                  </div>
                  <div className={ classes.infoItem }>
                    <Typography>
                      <h4>
                        <DeviceHubIcon /> Repositórios
                      </h4>
                      <p>{ user.repos }</p>
                    </Typography>
                  </div>
                </div>
                <div className={ classes.row }>
                  <Paper className={ classes.menuContainer }>
                    <MenuList>
                      <MenuItem
                        onClick={ () => this.props.history.push('/profile/tasks') }
                        className={ classes.menuItem }
                        selected={ this.state.selected === 0 }
                      >
                        <ListItemIcon className={ classes.icon }>
                          <LibraryBooks />
                        </ListItemIcon>
                        <ListItemText
                          classes={ { primary: classes.primary } }
                          inset
                          primary={ <span>Tarefas</span> }
                        />
                      </MenuItem>
                      <MenuItem
                        onClick={ () => this.props.history.push('/profile/payment-options') }
                        className={ classes.menuItem }
                        selected={ this.state.selected === 1 }
                      >
                        <ListItemIcon className={ classes.icon }>
                          <CreditCard />
                        </ListItemIcon>
                        <ListItemText
                          classes={ { primary: classes.primary } }
                          inset
                          primary={
                            <span>Configurar pagamento</span>
                          }
                        />
                      </MenuItem>
                      <MenuItem
                        onClick={ () => this.props.history.push('/profile/preferences') }
                        className={ classes.menuItem }
                        selected={ this.state.selected === 2 }
                      >
                        <ListItemIcon className={ classes.icon }>
                          <Tune />
                        </ListItemIcon>
                        <ListItemText
                          classes={ { primary: classes.primary } }
                          inset
                          primary={
                            <span>Preferências</span>
                          }
                        />
                      </MenuItem>
                    </MenuList>
                  </Paper>
                </div>
              </div>
            </Grid>
          </Grid>
        </PageContent>
        <Bottom classes={ classes } />
      </Page>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object,
  user: PropTypes.object,
  history: PropTypes.object
}

export default withStyles(styles)(Profile)
