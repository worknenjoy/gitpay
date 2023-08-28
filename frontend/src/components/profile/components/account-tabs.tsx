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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AccountTabs({
    user,
    updateUser,
    deleteUser,
    addNotification,
    history,
}) {
  const [value, setValue] = React.useState(0);
  const [index, setIndex] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        history.push('/profile/user-account');
        break;
      case 1:
        history.push('/profile/user-account/details');
        break;
      case 2:
        history.push('/profile/user-account/bank');
        break;
      case 3:
        history.push('/profile/user-account/roles');
        break;
      case 4:
        history.push('/profile/user-account/skills');
        break;
      case 5:
        history.push('/profile/user-account/settings');
        break;
      default:
        history.push('/profile/user-account');
        break;
    }
  };

  useEffect(() => {
    if (history.location.pathname === '/profile/user-account') {
      setValue(0)
      setIndex(0);
    } else if (history.location.pathname === '/profile/user-account/details') {
      setValue(1)
      setIndex(1);
    } else if (history.location.pathname === '/profile/user-account/bank') {
      setValue(2)
      setIndex(2);
    } else if (history.location.pathname === '/profile/user-account/roles') {
      setValue(3)
      setIndex(3);
    } else if (history.location.pathname === '/profile/user-account/skills') {
      setValue(4)
      setIndex(4);
    } else if (history.location.pathname === '/profile/user-account/settings') {
      setValue(5)
      setIndex(5);
    }
  }, [history.location.pathname]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} aria-label="basic tabs example" onChange={handleChange}>
          <Tab label="Login and account details"   />
          <Tab label="Personal details and address"   />
          <Tab label="Bank account"  />
          <Tab label="Roles" />
          <Tab label="Skills" />
          <Tab label="Settings" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={index}>
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
      </TabPanel>
    </Box>
  );
}
