import React from 'react'
import { FormattedMessage } from 'react-intl'
import nameInitials from 'name-initials'
import { useHistory } from 'react-router-dom'
import {
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
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
import { StyledAvatar } from './account-menu.styles'

const AccountMenu = ({ open, handleClose, user, signOut }) => {
  const history = useHistory()
  const { data } = user
  const { id, name, username, picture_url, email, Types } = data

  const getUserType = (userTypes) => {
    return userTypes.some((type) => Types.map((t) => t.name).includes(type))
  }

  const handleLogout = () => {
    history.replace('/')
    signOut()
  }

  const MenuItems = [
    {
      name: (
        <FormattedMessage id="task.actions.account.profile.dashboard" defaultMessage="Dashboard" />
      ),
      icon: <Home />,
      onClick: () => window.location.assign('/#/profile'),
      type: ['contributor', 'maintainer', 'funding']
    },
    {
      name: (
        <FormattedMessage id="task.actions.account.profile.page" defaultMessage="Profile page" />
      ),
      icon: <Web />,
      onClick: () =>
        username
          ? window.location.assign(`/#/users/${id}-${username}/`)
          : window.location.assign(`/#/users/${id}`),
      type: ['contributor', 'maintainer', 'funding']
    },
    {
      name: <FormattedMessage id="task.actions.menu.user.account" defaultMessage="Account" />,
      icon: <AccountIcon />,
      onClick: () => window.location.assign('/#/profile/user-account'),
      type: ['contributor', 'maintainer', 'funding']
    },
    {
      name: (
        <FormattedMessage
          id="task.actions.account.profile.bank"
          defaultMessage="Setup Bank Account"
        />
      ),
      icon: <AccountBalance />,
      onClick: () => window.location.assign('/#/profile/payment-options'),
      type: ['contributor']
    },
    {
      name: (
        <FormattedMessage id="task.actions.account.profile.issues" defaultMessage="Your issues" />
      ),
      icon: <LibraryBooks />,
      onClick: () => window.location.assign('/#/profile/tasks'),
      type: ['maintainer']
    },
    {
      name: (
        <FormattedMessage id="task.actions.account.payments.topmenu" defaultMessage="Payments" />
      ),
      icon: <PaymentIcon />,
      onClick: () => window.location.assign('/#/profile/payments'),
      type: ['funding', 'maintainer']
    },
    {
      name: (
        <FormattedMessage
          id="task.actions.account.profile.preferences"
          defaultMessage="Preferences"
        />
      ),
      icon: <Tune />,
      onClick: () => window.location.assign('/#/profile/user-account/skills'),
      type: ['contributor']
    },
    {
      name: <FormattedMessage id="task.actions.account.settings" defaultMessage="Settings" />,
      icon: <Settings />,
      onClick: () => window.location.assign('/#/profile/user-account/settings'),
      type: ['contributor', 'maintainer', 'funding']
    },
    {
      name: <FormattedMessage id="task.actions.account.logout" defaultMessage="Logout" />,
      icon: <ExitToApp />,
      onClick: handleLogout,
      type: ['contributor', 'maintainer', 'funding']
    }
  ]

  return (
    <Drawer id="menu-appbar-language" open={open} onClose={handleClose} anchor={'right'}>
      <List>
        <ListItem>
          <ListItemText>
            <Chip
              avatar={
                picture_url ? (
                  <StyledAvatar alt={username || ''} src={picture_url} />
                ) : (
                  <StyledAvatar alt={username || ''} src="">
                    {username ? nameInitials(username) : <Person />}
                  </StyledAvatar>
                )
              }
              color="secondary"
              label={`${name || username} (${email})`}
            />
          </ListItemText>
        </ListItem>
        {MenuItems.map(
          (item, index) =>
            getUserType(item.type) && (
              <ListItemButton onClick={item.onClick} key={index}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.name}</ListItemText>
              </ListItemButton>
            )
        )}
      </List>
    </Drawer>
  )
}

export default AccountMenu
