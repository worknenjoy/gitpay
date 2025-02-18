import React from 'react';
import { FormattedMessage } from 'react-intl';
import nameInitials from 'name-initials'
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
  Business,
  AccountBox as AccountIcon,
  AccountBalance,
  Payment as PaymentIcon
} from '@material-ui/icons'
import { StyledAvatar } from '../../organisms/topbar/TopbarStyles';

const MenuItems = [
  {
    name: <FormattedMessage id='task.actions.account.profile.dashboard' defaultMessage='Dashboard' />,
    icon: <Home />,
    onClick: () => {},
    type: ['contributor', 'maintainer', 'funding']
  },
  {
    name: <FormattedMessage id='task.actions.account.profile.page' defaultMessage='Profile page' />,
    icon: <Web />,
    onClick: () => {},
    type: ['contributor', 'maintainer', 'funding']
  },
  {
    name: <FormattedMessage id='task.actions.menu.user.account' defaultMessage='Account' />,
    icon: <AccountIcon />,
    onClick: () => {},
    type: ['contributor', 'maintainer', 'funding']
  },
  {
    name: <FormattedMessage id='task.actions.account.profile.bank' defaultMessage='Setup Bank Account' />,
    icon: <AccountBalance />,
    onClick: () => {},
    type: ['contributor']
  },
  {
    name: <FormattedMessage id='task.actions.account.profile.issues' defaultMessage='Your issues' />,
    icon: <LibraryBooks />,
    onClick: () => {},
    type: ['maintainer']
  },
  {
    name: <FormattedMessage id='task.actions.account.profile.orgs' defaultMessage='Organizations' />,
    icon: <Business />,
    onClick: () => {},
    type: ['maintainer']
  },
  {
    name: <FormattedMessage id='task.actions.account.payments.topmenu' defaultMessage='Payments' />,
    icon: <PaymentIcon />,
    onClick: () => {},
    type: ['funding', 'maintainer']
  },
  {
    name: <FormattedMessage id='task.actions.account.profile.preferences' defaultMessage='Preferences' />,
    icon: <Tune />,
    onClick: () => {},
    type: ['contributor']
  },
  {
    name: <FormattedMessage id='task.actions.account.settings' defaultMessage='Settings' />,
    icon: <Settings />,
    onClick: () => {},
    type: ['contributor', 'maintainer', 'funding']
  },
  {
    name: <FormattedMessage id='task.actions.account.logout' defaultMessage='Logout' />,
    icon: <ExitToApp />,
    onClick: () => {},
    type: ['contributor', 'maintainer', 'funding']
  }
]

const AccountMenu = ({
  open,
  handleClose,
  user
}) => {
  const { data } = user;

  const getUserType = (userTypes) => {
    return userTypes.some(type => data.Types.map(t => t.name).includes(type));
  }

  return (
    <Drawer id='menu-appbar-language' open={ open } onClose={ handleClose } anchor={ 'right' }>
      <List>
        <ListItem>
          <ListItemText>
            <Chip
              avatar={ user.picture_url
                ? <StyledAvatar
                  alt={ data.username || '' }
                  src={ data.picture_url }
                />
                : <StyledAvatar alt={ user.username || '' } src=''>
                  { data.username ? nameInitials(data.username) : <Person /> }
                </StyledAvatar>
              }
              color='secondary'
              label={ `${data.name || data.username} (${data.email})` }
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