import React from 'react';
import { FormattedMessage } from 'react-intl';
import nameInitials from 'name-initials'
import { useHistory } from 'react-router-dom';
import {
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
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
} from '@material-ui/icons'
import { StyledAvatar } from '../../../organisms/layouts/topbar/TopbarStyles';

const AccountMenu = ({
  open,
  handleClose,
  loggedIn,
  signOut
}) => {
  const history = useHistory();
  const { user } = loggedIn;
  const { id, username } = user;

  const getUserType = (userTypes) => {
    return userTypes.some(type => user.Types.map(t => t.name).includes(type));
  }

  const handleLogout = () => {
    history.replace('/');
    signOut();
  }

  const MenuItems = [
    {
      name: <FormattedMessage id='task.actions.account.profile.dashboard' defaultMessage='Dashboard' />,
      icon: <Home />,
      onClick: () => window.location.assign('/#/profile'),
      type: ['contributor', 'maintainer', 'funding']
    },
    {
      name: <FormattedMessage id='task.actions.account.profile.page' defaultMessage='Profile page' />,
      icon: <Web />,
      onClick: () => username ? window.location.assign(`/#/users/${id}-${username}/`) : window.location.assign(`/#/users/${id}`),
      type: ['contributor', 'maintainer', 'funding']
    },
    {
      name: <FormattedMessage id='task.actions.menu.user.account' defaultMessage='Account' />,
      icon: <AccountIcon />,
      onClick: () => window.location.assign('/#/profile/user-account'),
      type: ['contributor', 'maintainer', 'funding']
    },
    {
      name: <FormattedMessage id='task.actions.account.profile.bank' defaultMessage='Setup Bank Account' />,
      icon: <AccountBalance />,
      onClick: () => window.location.assign('/#/profile/payment-options'),
      type: ['contributor']
    },
    {
      name: <FormattedMessage id='task.actions.account.profile.issues' defaultMessage='Your issues' />,
      icon: <LibraryBooks />,
      onClick: () => window.location.assign('/#/profile/tasks'),
      type: ['maintainer']
    },
    {
      name: <FormattedMessage id='task.actions.account.payments.topmenu' defaultMessage='Payments' />,
      icon: <PaymentIcon />,
      onClick: () => window.location.assign('/#/profile/payments'),
      type: ['funding', 'maintainer']
    },
    {
      name: <FormattedMessage id='task.actions.account.profile.preferences' defaultMessage='Preferences' />,
      icon: <Tune />,
      onClick: () => window.location.assign('/#/profile/user-account/skills'),
      type: ['contributor']
    },
    {
      name: <FormattedMessage id='task.actions.account.settings' defaultMessage='Settings' />,
      icon: <Settings />,
      onClick: () => window.location.assign('/#/profile/user-account/settings'),
      type: ['contributor', 'maintainer', 'funding']
    },
    {
      name: <FormattedMessage id='task.actions.account.logout' defaultMessage='Logout' />,
      icon: <ExitToApp />,
      onClick: handleLogout,
      type: ['contributor', 'maintainer', 'funding']
    }
  ]

  return (
    <Drawer id='menu-appbar-language' open={ open } onClose={ handleClose } anchor={ 'right' }>
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
        { MenuItems.map((item, index) => (
          getUserType(item.type) &&
          <ListItem button onClick={ item.onClick } key={ index }>
            <ListItemIcon>
              { item.icon }
            </ListItemIcon>
            <ListItemText>
              { item.name }
            </ListItemText>
          </ListItem>
        )) }
      </List>
    </Drawer>
  );
}

export default AccountMenu;