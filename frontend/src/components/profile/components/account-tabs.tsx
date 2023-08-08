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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function AccountTabs({
    user,
    updateUser,
    deleteUser,
    addNotification,
    history
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (history.location.path === '/profile/user-account/') {
      setValue(0);
    } else if (history.location.path === '/profile/user-account/details') {
      setValue(1);
    } else if (history.location.path === '/profile/user-account/bank') {
      setValue(2);
    } else if (history.location.path === '/profile/user-account/roles') {
      setValue(3);
    } else if (history.location.path === '/profile/user-account/skills') {
      setValue(4);
    } else if (history.location.path === '/profile/user-account/settings') {
      setValue(5);
    }
  }, []);

  const onTabClick = (e, path) => {
    //e.preventDefault();
    console.log('onTabClick', e)
    history.push(path)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Login and account details" {...a11yProps(0)} onClick={(e) => onTabClick(e, '/profile/user-account/')} />
          <Tab label="Personal details and address" {...a11yProps(1)} onClick={(e) => onTabClick(e, '/profile/user-account/details')} />
          <Tab label="Bank account" {...a11yProps(2)} onClick={(e) => onTabClick(e, '/profile/user-account/bank')} />
          <Tab label="Roles" {...a11yProps(3)} onClick={(e) => onTabClick(e, '/profile/user-account/roles')} />
          <Tab label="Skills" {...a11yProps(4)} onClick={(e) => onTabClick(e, '/profile/user-account/skills')} />
          <Tab label="Settings" {...a11yProps(5)} onClick={(e) => onTabClick(e, '/profile/user-account/settings')} />
        </Tabs>
      </Box>
      <HashRouter>
        <Switch>
          <Route exact path="/profile/user-account" component={
            (props) => (
              <TabPanel value={value} index={0}>
                <AccountTabMain
                  user={user}
                  updateUser={updateUser}
                  addNotification={addNotification}
                  deleteUser={deleteUser}
                  history={history}
                />
              </TabPanel>
            )} 
          />
          <Route exact path="/profile/user-account/details" component={
            (props) => (
              <TabPanel value={value} index={1}>
                <AccountDetails />
              </TabPanel>
            )
            } 
          />
          <Route path="/profile/user-account/bank" component={
            (props) => (  
              <TabPanel value={value} index={2}>
                <PaymentOptions />
              </TabPanel>
            )
          } />
          <Route path="/profile/user-account/roles" component={
            (props) => (
              <TabPanel value={value} index={3}>
                <UserRoles />
              </TabPanel>
            ) 
          } />
          <Route path="/profile/user-account/skills" component={
            (props) => (
              <TabPanel value={value} index={4}>
                <Preferences 
                  user={user}
                  preferences={user}
                  updateUser={updateUser}
                />
              </TabPanel>
            )
          } />
          <Route path="/profile/user-account/settings" component={
            (props) => (
              <TabPanel value={value} index={5}>
                <SettingsComponent
                  updateUser={updateUser}
                  user={user}
                />
              </TabPanel>
            )
          } />
        </Switch>
      </HashRouter>
    </Box>
  );
}
