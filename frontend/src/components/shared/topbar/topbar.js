/*
 *
 * Deprecated
 *
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { store } from '../../../main/app'

import {
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  Avatar,
  CircularProgress,
  Menu,
  MenuItem,
  Button
} from '@mui/material'
import {
  LibraryBooks,
  Tune,
  Home,
  Web,
  Person,
  ExitToApp,
  Settings,
  AccountBox as AccountIcon,
  AccountBalance,
  Payment as PaymentIcon
} from '@mui/icons-material'

import { withRouter } from 'react-router-dom'
import { updateIntl } from 'react-intl-redux'

import nameInitials from 'name-initials'

import {
  Bar,
  Container,
  LeftSide,
  RightSide,
  Logo,
  StyledButton,
  LinkButton,
  LabelButton,
  StyledAvatar,
  StyledAvatarIconOnly,
  OnlyDesktop,
  OnlyMobile,
  MenuMobile,
  IconHamburger
} from './TopbarStyles'

import messagesBr from '../../../translations/result/br.json'
import messagesEn from '../../../translations/result/en.json'

import messagesBrLocal from '../../../translations/generated/br.json'
import messagesEnLocal from '../../../translations/generated/en.json'

import LoginButton from '../../areas/private/components/session/login-button'
import ImportIssueButton from './import-issue'

import logo from 'images/gitpay-logo.png'

import logoLangEn from 'images/united-states-of-america.png'
import logoLangBr from 'images/brazil.png'
import ImportIssueDialog from './import-issue-dialog'
import TopbarMenu from './topbar-menu'

const languagesIcons = {
  en: logoLangEn,
  br: logoLangBr
}

const messages = {
  br: process.env.NODE_ENV === 'production' ? messagesBr : messagesBrLocal,
  en: process.env.NODE_ENV === 'production' ? messagesEn : messagesEnLocal
}

const browserLanguage = () => {
  const browserLang = navigator.language.split(/[-_]/)[0]
  if (browserLang === 'pt') {
    return 'br'
  }
  return browserLang
}

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
  return preferences.language || localStorageLang() || browserLanguage()
}

class TopBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null,
      createTaskDialog: false,
      joinSlackDialog: false,
      isActive: false.value,
      mode: null
    }
  }

  componentDidMount() {
    /* eslint-disable no-undef */
    const currentStoredLang = localStorage.getItem('userLanguage')
    this.props
      .fetchPreferences(this.props.user.id)
      .then(() => {
        if (!currentStoredLang) {
          const currentLangSuccess = currentUserLanguage(this.props.preferences)
          store.dispatch(
            updateIntl({
              locale: currentLangSuccess,
              messages: messages[currentLangSuccess]
            })
          )
        }
      })
      .catch((e) => {
        const currentLangError = currentUserLanguage(this.props.preferences)
        store.dispatch(
          updateIntl({
            locale: currentLangError,
            messages: messages[currentLangError]
          })
        )
      })
    this.props.info()
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

  handleClickDialogSignUser = (e, mode) => {
    this.props.openDialog('SignupUser')
    this.setState({ mode })
  }

  handleProvider = (e, option) => {
    e.preventDefault()
    this.setState({ provider: option })
  }

  handleClickMenuMobile = () => {
    const { isActive } = this.state
    this.setState({ isActive: !isActive })
  }

  handleSignUserDialogClose = () => {
    this.props.closeDialog()
  }

  handleJoinSlackDialogClose = () => {
    this.setState({ joinSlackDialog: false })
  }

  handleHome = () => {
    window.location.assign('/#/profile')
    this.setState({ anchorEl: null })
  }

  handleProfile = (e, id, username) => {
    username
      ? window.location.assign(`/#/users/${id}-${username}/`)
      : window.location.assign(`/#/users/${id}`)
    this.setState({ anchorEl: null })
  }

  handleSignOut = () => {
    this.props.history.replace({ pathname: '/' })
    this.props.signOut()
    this.setState({ anchorEl: null })
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
    store.dispatch(
      updateIntl({
        locale: lang,
        messages: messages[lang]
      })
    )
  }

  render() {
    const { completed, user, preferences, dialog, history } = this.props
    const { mode, isActive } = this.state
    const isLoggedIn = this.props.logged
    const anchorEl = this.state.anchorEl
    const userCurrentLanguage = currentUserLanguage(preferences)

    return (
      <Bar>
        <Container>
          <LeftSide isActive={isActive}>
            <div>
              <StyledButton href="/">
                <Logo src={logo} />
              </StyledButton>
            </div>
            <OnlyDesktop style={{ marginTop: 12, marginLeft: 20 }}>
              <TopbarMenu />
            </OnlyDesktop>

            <MenuMobile onClick={this.handleClickMenuMobile} variant="text" size="small">
              <IconHamburger isActive={isActive} />
            </MenuMobile>
          </LeftSide>
          <RightSide isActive={isActive}>
            <OnlyMobile>
              <TopbarMenu />
            </OnlyMobile>
            {!isLoggedIn ? (
              <React.Fragment>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginRight: 20 }}>
                  <LinkButton
                    onClick={(e) => this.handleClickDialogSignUser(e, 'signup')}
                    variant="text"
                    size="small"
                    color="primary"
                  >
                    <LabelButton>
                      <FormattedMessage id="topbar.signup.label" defaultMessage="Signup" />
                    </LabelButton>
                  </LinkButton>

                  <LinkButton
                    onClick={(e) => this.handleClickDialogSignUser(e, 'signin')}
                    variant="text"
                    size="small"
                    color="primary"
                  >
                    <LabelButton>
                      <FormattedMessage id="topbar.signin.label" defaultMessage="Signin" />
                    </LabelButton>
                  </LinkButton>
                  <FormattedMessage
                    id="task.actions.tooltip.language"
                    defaultMessage="Choose your language"
                  >
                    {(msg) => (
                      <Tooltip id="tooltip-lang" title={msg} placement="bottom">
                        <Button style={{ padding: 0 }} id="language-menu" onClick={this.handleMenu}>
                          {completed ? (
                            <StyledAvatarIconOnly
                              alt={user.username || ''}
                              src={logoLang(userCurrentLanguage)}
                            />
                          ) : (
                            <Avatar>
                              <CircularProgress />
                            </Avatar>
                          )}
                        </Button>
                      </Tooltip>
                    )}
                  </FormattedMessage>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={anchorEl && anchorEl.id === 'language-menu'}
                    onClose={this.handleClose}
                  >
                    <MenuItem
                      selected={userCurrentLanguage === 'en'}
                      onClick={(e) => this.switchLang('en')}
                    >
                      <StyledAvatarIconOnly alt="English" src={logoLangEn} />
                      <strong style={{ display: 'inline-block', margin: 10 }}>English</strong>
                    </MenuItem>
                    <MenuItem
                      selected={userCurrentLanguage === 'br'}
                      onClick={(e) => this.switchLang('br')}
                    >
                      <StyledAvatarIconOnly alt="Português" src={logoLangBr} />
                      <strong style={{ display: 'inline-block', margin: 10 }}>Português</strong>
                    </MenuItem>
                  </Menu>
                </div>
                <Dialog
                  open={dialog.open && dialog.target === 'SignupUser'}
                  onClose={this.handleSignUserDialogClose}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogContent>
                    <div
                      style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
                    >
                      <LoginButton
                        referer={this.props.location}
                        size="medium"
                        includeForm
                        mode={mode}
                        onClose={this.handleSignUserDialogClose}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <StyledButton
                  onClick={this.handleMenu}
                  variant="text"
                  size="small"
                  color="primary"
                  id="account-menu"
                >
                  <Chip
                    avatar={
                      user.picture_url ? (
                        <StyledAvatar alt={user.username || ''} src={user.picture_url} />
                      ) : (
                        <StyledAvatar alt={user.username || ''} src="">
                          {user.username ? nameInitials(user.username) : <Person />}
                        </StyledAvatar>
                      )
                    }
                    color="secondary"
                    label="Account"
                    onClick={this.handleMenu}
                  />
                </StyledButton>
              </React.Fragment>
            )}
            {isLoggedIn ? (
              <ImportIssueDialog
                open={this.state.createTaskDialog}
                onClose={this.handleClickDialogCreateTaskClose}
                onCreate={(props) => {
                  this.props.createTask(props, history)
                  this.handleClickDialogCreateTaskClose()
                }}
                user={user}
              />
            ) : (
              <Dialog
                open={this.state.createTaskDialog}
                onClose={this.handleClickDialogCreateTaskClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  <FormattedMessage
                    id="task.actions.gitpay.call"
                    defaultMessage="Join the Gitpay community"
                  />
                </DialogTitle>
                <DialogContent>
                  <LoginButton referer={this.props.location} size="medium" includeForm />
                </DialogContent>
              </Dialog>
            )}
            <OnlyDesktop>
              <Drawer
                id="menu-appbar-language"
                open={anchorEl && anchorEl.id === 'account-menu'}
                onClose={this.handleClose}
                anchor={'right'}
              >
                <List>
                  <ListItem>
                    <ListItemText>
                      <Chip
                        avatar={
                          user.picture_url ? (
                            <StyledAvatar alt={user.username || ''} src={user.picture_url} />
                          ) : (
                            <StyledAvatar alt={user.username || ''} src="">
                              {user.username ? nameInitials(user.username) : <Person />}
                            </StyledAvatar>
                          )
                        }
                        color="secondary"
                        label={`${user.name || user.username} (${user.email})`}
                      />
                    </ListItemText>
                  </ListItem>
                  <ListItem button onClick={this.handleHome}>
                    <ListItemIcon>
                      <Home />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage
                        id="task.actions.account.profile.dashboard"
                        defaultMessage="Dashboard"
                      />
                    </ListItemText>
                  </ListItem>
                  <ListItem button onClick={(e) => this.handleProfile(e, user.id, user.username)}>
                    <ListItemIcon>
                      <Web />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage
                        id="task.actions.account.profile.page"
                        defaultMessage="Profile page"
                      />
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => {
                      window.location.assign('/#/profile/user-account')
                      this.setState({ anchorEl: null })
                    }}
                  >
                    <ListItemIcon>
                      <AccountIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage
                        id="task.actions.menu.user.account"
                        defaultMessage="Account"
                      />
                    </ListItemText>
                  </ListItem>
                  {user.Types && user.Types.map((t) => t.name).includes('contributor') && (
                    <ListItem
                      button
                      onClick={() => {
                        window.location.assign('/#/profile/payout-settings')
                        this.setState({ anchorEl: null })
                      }}
                    >
                      <ListItemIcon>
                        <AccountBalance />
                      </ListItemIcon>
                      <ListItemText>
                        <FormattedMessage
                          id="task.actions.account.profile.bank"
                          defaultMessage="Setup Bank Account"
                        />
                      </ListItemText>
                    </ListItem>
                  )}
                  {user.Types && user.Types.map((t) => t.name).includes('maintainer') && (
                    <ListItem
                      button
                      onClick={() => {
                        window.location.assign('/#/profile/tasks')
                        this.setState({ anchorEl: null })
                      }}
                    >
                      <ListItemIcon>
                        <LibraryBooks />
                      </ListItemIcon>
                      <ListItemText>
                        <FormattedMessage
                          id="task.actions.account.profile.issues"
                          defaultMessage="Your issues"
                        />
                      </ListItemText>
                    </ListItem>
                  )}
                  {user.Types &&
                    (user.Types.map((t) => t.name).includes('funding') ||
                      user.Types.map((t) => t.name).includes('maintainer')) && (
                      <ListItem
                        button
                        onClick={() => {
                          window.location.assign('/#/profile/payments')
                          this.setState({ anchorEl: null })
                        }}
                      >
                        <ListItemIcon>
                          <PaymentIcon />
                        </ListItemIcon>
                        <ListItemText>
                          <FormattedMessage
                            id="task.actions.account.payments.topmenu"
                            defaultMessage="Payments"
                          />
                        </ListItemText>
                      </ListItem>
                    )}
                  {user.Types && user.Types.map((t) => t.name).includes('contributor') && (
                    <ListItem
                      button
                      onClick={() => {
                        window.location.assign('/#/profile/user-account/skills')
                        this.setState({ anchorEl: null })
                      }}
                    >
                      <ListItemIcon>
                        <Tune />
                      </ListItemIcon>
                      <ListItemText>
                        <FormattedMessage
                          id="task.actions.account.profile.preferences"
                          defaultMessage="Preferences"
                        />
                      </ListItemText>
                    </ListItem>
                  )}
                  <ListItem
                    button
                    onClick={() => {
                      window.location.assign('/#/profile/user-account/settings')
                      this.setState({ anchorEl: null })
                    }}
                  >
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage
                        id="task.actions.account.settings"
                        defaultMessage="Settings"
                      />
                    </ListItemText>
                  </ListItem>
                  <ListItem button onClick={this.handleSignOut}>
                    <ListItemIcon>
                      <ExitToApp />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id="task.actions.account.logout" defaultMessage="Logout" />
                    </ListItemText>
                  </ListItem>
                </List>
              </Drawer>
            </OnlyDesktop>
            <ImportIssueButton onAddIssueClick={(e) => this.handleClickDialogCreateTask(e)} />
          </RightSide>
        </Container>
      </Bar>
    )
  }
}

TopBar.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  user: PropTypes.object,
  preferences: PropTypes.object,
  fetchPreferences: PropTypes.func,
  createTask: PropTypes.func,
  updateUser: PropTypes.func,
  signOut: PropTypes.func,
  logged: PropTypes.bool,
  completed: PropTypes.bool
}

export default withRouter(TopBar)

/* notification badge

<Badge badgeContent={4} color='secondary'>
  <NotificationIcon color='primary'/>
</Badge>
*/
