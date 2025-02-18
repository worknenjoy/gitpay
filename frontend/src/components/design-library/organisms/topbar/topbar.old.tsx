import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { store } from '../../../../main/app'

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
} from '@material-ui/core'
import {
  LibraryBooks,
  Tune,
  Home,
  Web,
  Person,
  ExitToApp,
  Settings,
  Business,
  AccountBox as AccountIcon,
  AccountBalance,
  Payment as PaymentIcon
} from '@material-ui/icons'

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

import messagesBr from '../../../../translations/result/br.json'
import messagesEn from '../../../../translations/result/en.json'

import messagesBrLocal from '../../../../translations/generated/br.json'
import messagesEnLocal from '../../../../translations/generated/en.json'

import LoginButton from '../../../areas/profile/components/session/login-button'
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
  'br': process.env.NODE_ENV === 'production' ? messagesBr : messagesBrLocal,
  'en': process.env.NODE_ENV === 'production' ? messagesEn : messagesEnLocal
}

const browserLanguage = () => {
  const browserLang = navigator.language.split(/[-_]/)[0]
  if (browserLang === 'pt') {
    return 'br'
  }
  return browserLang
}

const localStorageLang = () => {
  return localStorage.getItem('userLanguage')
}

const logoLang = (lang) => {
  return languagesIcons[lang]
}

const currentUserLanguage = (preferences) => {
  const prefLang = preferences.language
  if (prefLang) {
    localStorage.setItem('userLanguage', prefLang)
  }
  return preferences.language || localStorageLang() || browserLanguage()
}

const Topbar = (props) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [createTaskDialog, setCreateTaskDialog] = useState(false)
  const [joinSlackDialog, setJoinSlackDialog] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState(null)

  useEffect(() => {
    const currentStoredLang = localStorage.getItem('userLanguage')
    props.fetchPreferences(props.user.id).then(() => {
      if (!currentStoredLang) {
        const currentLangSuccess = currentUserLanguage(props.preferences)
        store.dispatch(updateIntl({
          locale: currentLangSuccess,
          messages: messages[currentLangSuccess],
        }))
      }
    }).catch(e => {
      const currentLangError = currentUserLanguage(props.preferences)
      store.dispatch(updateIntl({
        locale: currentLangError,
        messages: messages[currentLangError],
      }))
    })
    props.info()
  }, [])

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickDialogCreateTask = (e: any) => {
    setCreateTaskDialog(true)
  }

  const handleClickDialogCreateTaskClose = () => {
    setCreateTaskDialog(false)
  }

  const handleClickDialogSignUser = (e, mode) => {
    props.openDialog('SignupUser')
    setMode(mode)
  }

  const handleClickMenuMobile = () => {
    setIsActive(!isActive)
  }

  const handleSignUserDialogClose = () => {
    props.closeDialog()
  }

  const handleJoinSlackDialogClose = () => {
    setJoinSlackDialog(false)
  }

  const handleHome = () => {
    window.location.assign('/#/profile')
    setAnchorEl(null)
  }

  const handleProfile = (e, id, username) => {
    username ? window.location.assign(`/#/users/${id}-${username}/`) : window.location.assign(`/#/users/${id}`)
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    props.history.replace({ pathname: '/' })
    props.signOut()
    setAnchorEl(null)
  }

  const switchLang = (lang) => {
    setAnchorEl(null)
    if (props.logged) {
      props.updateUser(props.user.id, {
        language: lang
      })
    }
    localStorage.setItem('userLanguage', lang)
    store.dispatch(updateIntl({
      locale: lang,
      messages: messages[lang],
    }))
  }

  const { completed, user, preferences, dialog, history } = props
  const userCurrentLanguage = currentUserLanguage(preferences)
  const isLoggedIn = props.logged

  return (
    <Bar>
      <Container>
        <LeftSide isActive={ isActive }>
          <div>
            <StyledButton href='/'>
              <Logo src={ logo } />
            </StyledButton>
          </div>
          <OnlyDesktop style={ { marginTop: 12, marginLeft: 20 } }>
            <TopbarMenu />
          </OnlyDesktop>

          <MenuMobile
            onClick={ handleClickMenuMobile }
            variant='text'
            size='small'
          >
            <IconHamburger isActive={ isActive } />
          </MenuMobile>
        </LeftSide>
        <RightSide isActive={ isActive }>
          <OnlyMobile>
            <TopbarMenu />
          </OnlyMobile>
          { !isLoggedIn
            ? (
              <React.Fragment>
                <div style={ { display: 'flex', justifyContent: 'space-around', marginRight: 20 } }>
                  <LinkButton
                    onClick={ (e) => handleClickDialogSignUser(e, 'signup') }
                    variant='text'
                    size='small'
                    color='primary'
                  >
                    <LabelButton>
                      <FormattedMessage
                        id='topbar.signup.label'
                        defaultMessage='Signup' />
                    </LabelButton>
                  </LinkButton>

                  <LinkButton
                    onClick={ (e) => handleClickDialogSignUser(e, 'signin') }
                    variant='text'
                    size='small'
                    color='primary'
                  >
                    <LabelButton>
                      <FormattedMessage
                        id='topbar.signin.label'
                        defaultMessage='Signin' />
                    </LabelButton>
                  </LinkButton>
                  <FormattedMessage id='task.actions.tooltip.language' defaultMessage='Choose your language'>
                    { (msg) => (
                      <Tooltip id='tooltip-lang' title={ msg } placement='bottom'>
                        <Button style={ { padding: 0 } } id='language-menu' onClick={ handleMenu }>
                          { completed ? (
                            <StyledAvatarIconOnly
                              alt={ user.username || '' }
                              src={ logoLang(userCurrentLanguage) }
                            />
                          ) : (
                            <Avatar>
                              <CircularProgress />
                            </Avatar>
                          ) }
                        </Button>
                      </Tooltip>
                    ) }
                  </FormattedMessage>
                  <Menu
                    id='menu-appbar'
                    anchorEl={ anchorEl }
                    anchorOrigin={ { vertical: 'top', horizontal: 'right' } }
                    transformOrigin={ { vertical: 'top', horizontal: 'right' } }
                    open={ anchorEl && anchorEl.id === 'language-menu' }
                    onClose={ handleClose }
                  >
                    <MenuItem selected={ userCurrentLanguage === 'en' } onClick={ (e) => switchLang('en') }>
                      <StyledAvatarIconOnly
                        alt='English'
                        src={ logoLangEn }
                      />
                      <strong style={ { display: 'inline-block', margin: 10 } }>English</strong>
                    </MenuItem>
                    <MenuItem selected={ userCurrentLanguage === 'br' } onClick={ (e) => switchLang('br') }>
                      <StyledAvatarIconOnly
                        alt='Português'
                        src={ logoLangBr }
                      />
                      <strong style={ { display: 'inline-block', margin: 10 } }>Português</strong>
                    </MenuItem>
                  </Menu>
                </div>
                <Dialog
                  open={ dialog.open && dialog.target === 'SignupUser' }
                  onClose={ handleSignUserDialogClose }
                  aria-labelledby='form-dialog-title'
                >
                  <DialogContent>
                    <div style={ { display: 'flex', justifyContent: 'center', position: 'relative' } }>
                      <LoginButton
                        referrer={ props.location }
                        size='medium'
                        includeForm
                        mode={ mode }
                        onClose={ handleSignUserDialogClose }
                        classes={{
                          gutterLeft: ''
                        }} // Add this line
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <StyledButton
                  onClick={ handleMenu }
                  variant='text'
                  size='small'
                  color='primary'
                  id='account-menu'
                >
                  <Chip
                    avatar={ user.picture_url
                      ? <StyledAvatar
                        alt={ user.username || '' }
                        src={ user.picture_url }
                      />
                      : <StyledAvatar alt={ user.username || '' } src=''>
                        { user.username ? nameInitials(user.username) : <Person /> }
                      </StyledAvatar>
                    }
                    color='secondary'
                    label='Account'
                    onClick={ handleMenu }
                  />
                </StyledButton>
              </React.Fragment>
            )
          }
          { isLoggedIn ? (
            <ImportIssueDialog
              open={ createTaskDialog }
              onClose={ handleClickDialogCreateTaskClose }
              onCreate={ (props) => {
                props.createTask(props, history)
                handleClickDialogCreateTaskClose()
              } }
              user={ user }
            />
          ) : (
            <Dialog
              open={ createTaskDialog }
              onClose={ handleClickDialogCreateTaskClose }
              aria-labelledby='form-dialog-title'
            >
              <DialogTitle id='form-dialog-title'>
                <FormattedMessage id='task.actions.gitpay.call' defaultMessage='Join the Gitpay community' />
              </DialogTitle>
              <DialogContent>
                <LoginButton referrer={ props.location } size='medium' includeForm classes={{ gutterLeft: ''}} />
              </DialogContent>
            </Dialog>
          ) }
          <OnlyDesktop>
            <Drawer id='menu-appbar-language' open={ anchorEl && anchorEl.id === 'account-menu' } onClose={ handleClose } anchor={ 'right' }>
              <List>
                <ListItem>
                  <ListItemText>
                    <Chip
                      avatar={ user.picture_url
                        ? <StyledAvatar
                          alt={ user.username || '' }
                          src={ user.picture_url }
                        />
                        : <StyledAvatar alt={ user.username || '' } src=''>
                          { user.username ? nameInitials(user.username) : <Person /> }
                        </StyledAvatar>
                      }
                      color='secondary'
                      label={ `${user.name || user.username} (${user.email})` }
                    />
                  </ListItemText>
                </ListItem>
                <ListItem button onClick={ handleHome }>
                  <ListItemIcon>
                    <Home />
                  </ListItemIcon>
                  <ListItemText>
                    <FormattedMessage id='task.actions.account.profile.dashboard' defaultMessage='Dashboard' />
                  </ListItemText>
                </ListItem>
                <ListItem button onClick={ (e) => handleProfile(e, user.id, user.username) }>
                  <ListItemIcon>
                    <Web />
                  </ListItemIcon>
                  <ListItemText>
                    <FormattedMessage id='task.actions.account.profile.page' defaultMessage='Profile page' />
                  </ListItemText>
                </ListItem>
                <ListItem button onClick={ () => {
                  window.location.assign('/#/profile/user-account')
                  setAnchorEl(null)
                } }>
                  <ListItemIcon>
                    <AccountIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <FormattedMessage id='task.actions.menu.user.account' defaultMessage='Account' />
                  </ListItemText>
                </ListItem>
                { user.Types && user.Types.map(t => t.name).includes('contributor') &&
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/payment-options')
                    setAnchorEl(null)
                  } }>
                    <ListItemIcon>
                      <AccountBalance />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.profile.bank' defaultMessage='Setup Bank Account' />
                    </ListItemText>
                  </ListItem>
                }
                { user.Types && user.Types.map(t => t.name).includes('maintainer') &&
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/tasks')
                    setAnchorEl(null)
                  } }>
                    <ListItemIcon>
                      <LibraryBooks />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.profile.issues' defaultMessage='Your issues' />
                    </ListItemText>
                  </ListItem>
                }
                { user.Types && user.Types.map(t => t.name).includes('maintainer') &&
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/user/orgs')
                    setAnchorEl(null)
                  } }>
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.profile.orgs' defaultMessage='Organizations' />
                    </ListItemText>
                  </ListItem>
                }
                { user.Types && (user.Types.map(t => t.name).includes('funding') || user.Types.map(t => t.name).includes('maintainer')) &&
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/payments')
                    setAnchorEl(null)
                  } }>
                    <ListItemIcon>
                      <PaymentIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.payments.topmenu' defaultMessage='Payments' />
                    </ListItemText>
                  </ListItem>
                }
                { user.Types && user.Types.map(t => t.name).includes('contributor') &&
                  <ListItem button onClick={ () => {
                    window.location.assign('/#/profile/user-account/skills')
                    setAnchorEl(null)
                  } }>
                    <ListItemIcon>
                      <Tune />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id='task.actions.account.profile.preferences' defaultMessage='Preferences' />
                    </ListItemText>
                  </ListItem>
                }
                <ListItem button onClick={ () => {
                  window.location.assign('/#/profile/settings')
                  setAnchorEl(null)
                } }>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText>
                    <FormattedMessage id='task.actions.account.settings' defaultMessage='Settings' />
                  </ListItemText>
                </ListItem>
                <ListItem button onClick={ handleSignOut }>
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText>
                    <FormattedMessage id='task.actions.account.logout' defaultMessage='Logout' />
                  </ListItemText>
                </ListItem>
              </List>
            </Drawer>
          </OnlyDesktop>
          <ImportIssueButton onAddIssueClick={ (e) => handleClickDialogCreateTask(e) } classes={{}} />
        </RightSide>
      </Container>
    </Bar>
  )
}

export default Topbar
