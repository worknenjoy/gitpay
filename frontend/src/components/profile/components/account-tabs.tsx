import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import AccountDetails from '../../../containers/account-details';
import UserRoles from '../../../containers/user-roles';
import PaymentOptions from '../../payment/payment-options';

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
    console.log('history', history)
    if (history.location.hash === '#main') {
      setValue(0);
    } else if (history.location.hash === '#details') {
      setValue(1);
    } else if (history.location.hash === '#bank') {
      setValue(2);
    } else if (history.location.hash === '#roles') {
      setValue(3);
    }
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Login and account details" {...a11yProps(0)} />
          <Tab label="Personal details and address" {...a11yProps(1)} />
          <Tab label="Bank account" {...a11yProps(2)} />
          <Tab label="Roles" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AccountTabMain 
          user={user}
          updateUser={updateUser}
          addNotification={addNotification}
          deleteUser={deleteUser}
          history={history}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AccountDetails />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PaymentOptions />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <UserRoles />
      </TabPanel>
    </Box>
  );
}
