import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { HashRouter, Switch, Route } from 'react-router-dom';

import AccountDetails from '../../../containers/account-details';
import UserRoles from '../../../containers/user-roles';
import PaymentOptions from '../../payment/payment-options';
import SettingsComponent from '../settings';
import Preferences from '../preferences';


import AccountTabMain from './account-tab-main';

export default function AccountTabs({
    user,
    updateUser,
    deleteUser,
    addNotification,
    history,
}) {
  const [value, setValue] = React.useState('account');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    switch (newValue) {
      case 'account':
        history.push('/profile/user-account');
        break;
      case 'details':
        history.push('/profile/user-account/details');
        break;
      case 'bank':
        history.push('/profile/user-account/bank');
        break;
      case 'roles':
        history.push('/profile/user-account/roles');
        break;
      case 'skills':
        history.push('/profile/user-account/skills');
        break;
      case 'settings':
        history.push('/profile/user-account/settings');
        break;
      default:
        history.push('/profile/user-account');
        break;
    }
  };

  useEffect(() => {
    if (history.location.pathname === '/profile/user-account') {
      setValue('account')
    } else if (history.location.pathname === '/profile/user-account/details') {
      setValue('details')
    } else if (history.location.pathname === '/profile/user-account/bank') {
      setValue('bank')
    } else if (history.location.pathname === '/profile/user-account/roles') {
      setValue('roles')
    } else if (history.location.pathname === '/profile/user-account/skills') {
      setValue('skills')
    } else if (history.location.pathname === '/profile/user-account/settings') {
      setValue('settings')
    }
  }, [history.location.pathname]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} aria-label="basic tabs example" onChange={handleChange}>
          <Tab label="Login and account details" value={'account'}   />
          <Tab label="Personal details and address" value={'details'}  />
          { user?.Types?.map(u => u.name)?.includes('contributor') && 
            <Tab label="Bank account" value={'bank'}  />
          }
          <Tab label="Roles" value='roles' />
          <Tab label="Skills" value='skills' />
          <Tab label="Settings" value='settings' />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        <HashRouter>
          <Switch>
            <Route exact path="/profile/user-account" component={
              (props) => (
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
            <Route exact path="/profile/user-account/bank" component={
              (props) => (  
                  <PaymentOptions />
              )
            } />
            <Route exact path="/profile/user-account/roles" component={
              (props) => (
                  <UserRoles />
              ) 
            } />
            <Route exact path="/profile/user-account/skills" component={
              (props) => (
                  <Preferences 
                    user={user}
                    preferences={user}
                    updateUser={updateUser}
                  />
              )
            } />
            <Route exact path="/profile/user-account/settings" component={
              (props) => (
                  <SettingsComponent
                    updateUser={updateUser}
                    user={user}
                  />
              )
            } />
          </Switch>
        </HashRouter>
      </Box>
    </Box>
  );
}
