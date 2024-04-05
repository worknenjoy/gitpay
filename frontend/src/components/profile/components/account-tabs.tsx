import React, { useEffect } from 'react';
import { Tabs, Tab, Box } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { HashRouter, Switch, Route } from 'react-router-dom';

import AccountDetails from '../../../containers/account-details';
import UserRoles from '../../../containers/user-roles';
import PaymentOptions from '../../payment/payment-options';
import SettingsComponent from '../settings';
import Preferences from '../preferences';
import AccountTabMain from './account-tab-main';

const routes = {
  '/profile/user-account': 'account',
  '/profile/user-account/details': 'details',
  '/profile/user-account/bank': 'bank',
  '/profile/user-account/roles': 'roles',
  '/profile/user-account/skills': 'skills',
  '/profile/user-account/settings': 'settings',
};

const getTabValue = (pathname) => {
  if (typeof pathname === 'string' && routes.hasOwnProperty(pathname)) {
    return routes[pathname];
  } else {
    return 'account';
  }
};

export default function AccountTabs({ user, updateUser, deleteUser, addNotification, history }) {
  const [value, setValue] = React.useState(getTabValue(history.location.pathname));

  const handleChange = React.useCallback(
    (event, newValue) => {
      const path = {
        'account': '/profile/user-account',
        'details': '/profile/user-account/details',
        'bank': '/profile/user-account/bank',
        'roles': '/profile/user-account/roles',
        'skills': '/profile/user-account/skills',
        'settings': '/profile/user-account/settings',
      }[newValue];

      history.push(path);
    },
    [history]
  );

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setValue(getTabValue(location.pathname));
    });

    return unlisten;
  }, [history]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          data-test-id="profile-account-tab"
          aria-label="basic tabs example"
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab
            label={
              <FormattedMessage id="profile.account.tab.login" defaultMessage="Login and account details" />
            }
            value={'account'}
          />
          {user?.Types?.map((u) => u.name)?.includes('contributor') && (
            <Tab
              label={
                <FormattedMessage id="profile.account.tab.details" defaultMessage="Personal details and address" />
              }
              value={'details'}
            />
          )}
          {user?.Types?.map((u) => u.name)?.includes('contributor') && (
            <Tab
              label={<FormattedMessage id="profile.account.tab.bank" defaultMessage="Bank details" />}
              value={'bank'}
            />
          )}
          <Tab
            label={<FormattedMessage id="profile.account.tab.roles" defaultMessage="Roles" />}
            value="roles"
          />
          {user?.Types?.map((u) => u.name)?.includes('contributor') && (
            <Tab
              label={<FormattedMessage id="profile.account.tab.skills" defaultMessage="Skills" />}
              value="skills"
            />
          )}
          <Tab
            label={<FormattedMessage id="profile.account.tab.settings" defaultMessage="Settings" />}
            value="settings"
          />
        </Tabs>
      </Box>
      <Box sx={{ p: 2, pl: 0 }}>
        <HashRouter>
          <Switch>
            <Route
              exact
              path="/profile/user-account"
              component={() => (
                <AccountTabMain
                  user={user}
                  updateUser={updateUser}
                  addNotification={addNotification}
                  deleteUser={deleteUser}
                  history={history}
                />
              )}
            />
            <Route exact path="/profile/user-account/details" component={AccountDetails} />
            <Route
              exact
              path="/profile/user-account/bank"
              component={() => <PaymentOptions />}
            />
            <Route exact path="/profile/user-account/roles" component={() => <UserRoles />} />
            <Route
              exact
              path="/profile/user-account/skills"
              component={() => (
                <Preferences user={user} preferences={user} updateUser={updateUser} />
              )}
            />
            <Route
              exact
              path="/profile/user-account/settings"
              component={() => <SettingsComponent updateUser={updateUser} user={user} />}
            />
          </Switch>
        </HashRouter>
      </Box>
    </Box>
  );
}
