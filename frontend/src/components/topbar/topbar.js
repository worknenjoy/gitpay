import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { store } from '../../main/app'

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

import Tooltip from 'material-ui/Tooltip'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Avatar from 'material-ui/Avatar'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import HomeIcon from 'material-ui-icons/Home'
import PlusIcon from 'material-ui-icons/Queue'
import UserIcon from 'material-ui-icons/AccountCircle'
import LibraryIcon from 'material-ui-icons/LibraryBooks'
import TasksIcon from 'material-ui-icons/ViewList'
import CircularProgress from 'material-ui/Progress/CircularProgress'

import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router-dom'
import { updateIntl } from 'react-intl-redux'

import Menu, { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import nameInitials from 'name-initials'
import isGithubUrl from 'is-github-url'

import {
  Bar,
  Container,
  LeftSide,
  RightSide,
  Logo,
  StyledButton,
  LabelButton,
  StyledAvatar,
  StyledAvatarIconOnly,
  OnlyDesktop,
} from './TopbarStyles'

import messagesBr from '../../translations/br.json'
import messagesEn from '../../translations/en.json'

import LoginButton from '../session/login-button'

const logo = require('../../images/gitpay-logo.png')
const logoGithub = require('../../images/github-logo-alternative.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

const logoLangEn = require('../../images/united-states-of-america.png')
const logoLangBr = require('../../images/brazil.png')

const languagesIcons = {
  en: logoLangEn,
  br: logoLangBr
}

const messages = {
  'br': messagesBr,
  'en': messagesEn
}

const browserLanguage = navigator.language.split(/[-_]/)[0]

const localStorageLang = () => {
  /* eslint-disable no-undef */
  return localStorage.getItem('userLanguage')
}

const logoLang = (lang) => {
  return languagesIcons[lang]
}

const currentUserLanguage = (preferences) => {
  const prefLang = preferences.language
  if (prefLang) {
    /* eslint-disable no-undef */
    localStorage.setItem('userLanguage', prefLang)
  }
  return preferences.language || localStorageLang() || browserLanguage
}

const isBitbucketUrl = (url) => {
  return url.indexOf('bitbucket') > -1
}

const styles = {
  formControl: {
    width: '100%'
  }
}

class TopBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      anchorEl: null,
      task: {
        url: {
          error: false,
          value: null
        }
      },
      provider: 'github',
      createTaskDialog: false,
      signUserDialog: false
    }
  }

  componentDidMount () {
    this.props.fetchPreferences(this.props.user.id).then(() => {
      const currentLangSuccess = currentUserLanguage(this.props.preferences)
      store.dispatch(updateIntl({
        locale: currentLangSuccess,
        messages: messages[currentLangSuccess],
      }))
    }).catch(e => {
      const currentLangError = currentUserLanguage(this.props.preferences)
      store.dispatch(updateIntl({
        locale: currentLangError,
        messages: messages[currentLangError],
      }))
    })
  }

  handleChange = (event, checked) => {
    this.setState({ auth: checked })
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleClickDialogCreateTask = () => {
    this.setState({ createTaskDialog: true })
  }

  handleClickDialogCreateTaskClose = () => {
    this.setState({ createTaskDialog: false })
  }

  handleClickDialogSignUser = (e) => {
    this.setState(({ signUserDialog: true }))
  }

  handleGithubLink = () => {
    window.open('https://github.com/worknenjoy/gitpay', '_blank')
  }

  handleDocsLink = () => {
    window.open('https://docs.gitpay.me', '_blank')
  }

  handleProvider = (e, option) => {
    e.preventDefault()
    this.setState({ provider: option })
  }

  onChange = (e) => {
    // Because we named the inputs to match their corresponding values in state, it's
    // super easy to update the state
    const task = this.state.task
    task[e.target.name].value = e.target.value
    task[e.target.name].error = false
    this.setState(task)
  }

  validURL = (url) => {
    return isGithubUrl(url) || isBitbucketUrl(url)
  }

  handleCreateTask = (e) => {
    const url = this.state.task.url.value
    if (this.validURL(url)) {
      this.props.createTask({
        url: this.state.task.url.value,
        provider: this.state.provider,
        userId: this.props.user ? this.props.user.id : null
      }, this.props.history)
      this.setState({ createTaskDialog: false })
    }
    else {
      this.setState({
        task: {
          url: {
            error: true
          }
        }
      })
    }
  }

  handleSignUserDialogClose = () => {
    this.setState({ signUserDialog: false })
  }

  handleProfile = () => {
    window.location.assign('/#/profile')
  }

  handleViewTasks = () => {
    window.location.assign('/#/tasks/explore')
  }

  handleSignOut = () => {
    this.props.history.replace({ pathname: '/' })
    this.props.signOut()
  }

  switchLang = (lang) => {
    this.setState({ anchorEl: null })
    if (this.props.logged) {
      this.props.updateUser(this.props.user.id, {
        language: lang
      })
    }
    /* eslint-disable no-undef */
    localStorage.setItem('userLanguage', lang)
    store.dispatch(updateIntl({
      locale: lang,
      messages: messages[lang],
    }))
  }

  render () {
    const { completed, user, preferences } = this.props
    const isLoggedIn = this.props.logged
    const anchorEl = this.state.anchorEl
    const userCurrentLanguage = currentUserLanguage(preferences)

    return (
      <Bar>
        <Container>
          <LeftSide>
            <StyledButton href='/'>
              <HomeIcon color='primary' />
              <Logo src={ logo } />
            </StyledButton>
          </LeftSide>
          <RightSide>
            <StyledButton
              onClick={ this.handleClickDialogCreateTask }
              variant='raised'
              size='small'
              color='primary'
            >
              <LabelButton>
                <FormattedMessage id='task.actions.create' defaultMessage='Create task' />
              </LabelButton><PlusIcon />
            </StyledButton>
            <StyledButton
              onClick={ this.handleViewTasks }
              variant='raised'
              size='small'
              color='primary'
            >
              <LabelButton>
                <FormattedMessage id='task.actions.explore' defaultMessage='Explore tasks' />
              </LabelButton>
              <TasksIcon />
            </StyledButton>

            <div>
              <StyledButton
                onClick={ this.handleDocsLink }
                variant='raised'
                size='small'
                color='default'
              >
                <LabelButton>
                  <FormattedMessage id='task.actions.docs' defaultMessage='Documentation' />
                </LabelButton><LibraryIcon />
              </StyledButton>
            </div>

            { !isLoggedIn
              ? (<div>
                <StyledButton
                  onClick={ this.handleClickDialogSignUser }
                  variant='raised'
                  size='small'
                  color='secondary'
                >
                  <LabelButton>
                    <FormattedMessage id='task.bar.signin' defaultMessage='Signin' />
                  </LabelButton><UserIcon />
                </StyledButton>

                <Dialog
                  open={ this.state.signUserDialog }
                  onClose={ this.handleSignUserDialogClose }
                  aria-labelledby='form-dialog-title'
                >
                  <DialogTitle id='form-dialog-title'>
                    <FormattedMessage id='task.actions.gitpay.call' defaultMessage='Join the Gitpay community' />
                  </DialogTitle>
                  <DialogContent>
                    <LoginButton referer={ this.props.location } size='medium' />
                  </DialogContent>
                </Dialog>
              </div>) : (
                <div>
                  <StyledButton
                    onClick={ this.handleMenu }
                    variant='raised'
                    size='small'
                    color='secondary'
                    id='account-menu'
                  >
                    <LabelButton>
                      <FormattedMessage id='task.actions.account' defaultMessage='Account' />
                    </LabelButton>
                    { user.picture_url &&
                      <StyledAvatar
                        alt={ user.username }
                        src={ user.picture_url }
                      />
                    }

                    { !user.picture_url &&
                      <StyledAvatar alt={ user.username } src=''>
                        { nameInitials(user.username) }
                      </StyledAvatar>
                    }
                  </StyledButton>
                </div>
              )
            }

            <form onSubmit={ this.handleCreateTask } action='POST'>
              <Dialog
                open={ this.state.createTaskDialog }
                onClose={ this.handleClickDialogCreateTaskClose }
                aria-labelledby='form-dialog-title'
              >
                <DialogTitle id='form-dialog-title'>
                  <FormattedMessage id='task.actions.insert.new' defaultMessage='Insert a new task' />
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <Typography type='subheading' gutterBottom>
                      <FormattedHTMLMessage id='task.actions.insert.subheading' defaultMessage='Paste the url of an incident of <strong>Github</strong> or <strong>Bitbucket</strong>' />
                    </Typography>
                  </DialogContentText>
                  <FormControl style={ styles.formControl } error={ this.state.task.url.error }>
                    <TextField error={ this.state.task.url.error }
                      onChange={ this.onChange }
                      autoFocus
                      margin='dense'
                      id='url'
                      name='url'
                      label='URL'
                      type='url'
                      fullWidth
                    />
                    <div style={ { marginTop: 10, marginBottom: 10 } }>
                      <Button
                        style={ { marginRight: 10 } }
                        color='primary'
                        variant={ this.state.provider === 'github' ? 'raised' : 'contained' }
                        id='github'
                        onClick={ (e) => this.handleProvider(e, 'github') }
                      >
                        <img width='16' src={ logoGithub } />
                        <span style={ { marginLeft: 10 } }>Github</span>
                      </Button>

                      <Button
                        color='primary'
                        variant={ this.state.provider === 'bitbucket' ? 'raised' : 'contained' }
                        id='bitbucket'
                        onClick={ (e) => this.handleProvider(e, 'bitbucket') }
                      >
                        <img width='16' src={ logoBitbucket } />
                        <span style={ { marginLeft: 10 } }>Bitbucket</span>
                      </Button>
                    </div>
                    { this.state.task.url.error &&
                    <FormHelperText error={ this.state.task.url.error }>
                      <FormattedMessage id='task.actions.insert.novalid' defaultMessage='This is not a valid URL' />
                    </FormHelperText>
                    }
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={ this.handleClickDialogCreateTaskClose } color='primary'>
                    <FormattedMessage id='task.actions.cancel' defaultMessage='Cancel' />
                  </Button>
                  <Button disabled={ !completed } onClick={ this.handleCreateTask } variant='raised' color='secondary' >
                    <FormattedMessage id='task.actions.insert.label' defaultMessage='Insert' />
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
            <Tooltip id='tooltip-lang' title='Escolher idioma' placement='bottom'>
              <Button style={ { padding: 0 } } id='language-menu' onClick={ this.handleMenu }>
                { completed ? (
                  <StyledAvatarIconOnly
                    alt={ user.username }
                    src={ logoLang(userCurrentLanguage) }
                  />
                ) : (
                  <Avatar>
                    <CircularProgress />
                  </Avatar>
                ) }
              </Button>
            </Tooltip>
            <Menu
              id='menu-appbar'
              anchorEl={ anchorEl }
              anchorOrigin={ { vertical: 'top', horizontal: 'right' } }
              transformOrigin={ { vertical: 'top', horizontal: 'right' } }
              open={ anchorEl && anchorEl.id === 'language-menu' }
              onClose={ this.handleClose }
            >
              <MenuItem selected={ userCurrentLanguage === 'en' } onClick={ (e) => this.switchLang('en') }>
                <StyledAvatarIconOnly
                  alt='English'
                  src={ logoLangEn }
                />
                <strong style={ { display: 'inline-block', margin: 10 } }>English</strong>
              </MenuItem>
              <MenuItem selected={ userCurrentLanguage === 'br' } onClick={ (e) => this.switchLang('br') } >
                <StyledAvatarIconOnly
                  alt='Português'
                  src={ logoLangBr }
                />
                <strong style={ { display: 'inline-block', margin: 10 } }>Português</strong>
              </MenuItem>
            </Menu>
            <OnlyDesktop>
              <Tooltip id='tooltip-github' title='Acessar nosso github' placement='bottom'>
                <StyledAvatarIconOnly
                  alt={ user.username }
                  src={ logoGithub }
                  onClick={ this.handleGithubLink }
                />
              </Tooltip>
              <Menu
                id='menu-appbar-language'
                anchorEl={ anchorEl }
                anchorOrigin={ { vertical: 'top', horizontal: 'right' } }
                transformOrigin={ { vertical: 'top', horizontal: 'right' } }
                open={ anchorEl && anchorEl.id === 'account-menu' }
                onClose={ this.handleClose }
              >
                <MenuItem onClick={ this.handleProfile }>
                  <FormattedMessage id='task.actions.account.access' defaultMessage='Access account' />
                </MenuItem>
                <MenuItem onClick={ this.handleSignOut }>
                  <FormattedMessage id='task.actions.account.logout' defaultMessage='Logout' />
                </MenuItem>
              </Menu>
            </OnlyDesktop>
          </RightSide>
        </Container>
      </Bar>
    )
  }
}

TopBar.propTypes = {
  isLogged: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
  user: PropTypes.object,
  preferences: PropTypes.object,
  fetchPreferences: PropTypes.func,
  createTask: PropTypes.func,
  updateUser: PropTypes.func,
  signOut: PropTypes.func,
  logged: PropTypes.bool,
  completed: PropTypes.bool,
}

export default withRouter(withStyles(styles)(TopBar))

/* notification badge

<Badge badgeContent={4} color='secondary'>
  <NotificationIcon color='primary'/>
</Badge>
*/
