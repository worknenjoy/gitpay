import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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
    addNotification
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Login and account details" {...a11yProps(0)} />
          {/*  <Tab label="Personal details and address" {...a11yProps(1)} /> */}
          {/*  <Tab label="Roles" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AccountTabMain user={user} updateUser={updateUser} addNotification={addNotification} />
      </TabPanel>
      {/* add later */}
      {/* <TabPanel value={value} index={1}> */}
      {/*  Item Two */}
      {/* </TabPanel> */}
      {/* <TabPanel value={value} index={2}>*/}
      {/*  Item Three */}
      {/* </TabPanel> */}
    </Box>
  );
}
