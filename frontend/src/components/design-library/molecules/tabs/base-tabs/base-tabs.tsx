import React, { useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex'
  },
  card: {
    width: '100%',
    marginBottom: 20,
    padding: 10
  },
  tabsVertical: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 280,
    alignItems: 'flex-end',
  },
  tabs: {
    flexDirection: 'column',
  },
  tab: {
    margin: 10,
    marginRight: 20
  },
  tabPanel: {
    width: '100%',
    marginTop: 20
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
}

function TabPanel(props: TabPanelProps) {
  const classes = useStyles();
  const { children } = props;

  return (
    <div
      role="tabpanel"
      className={classes.tabPanel}
    >  
      <Box p={0}>
        <Card className={classes.card} elevation={0}>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

type BaseTabsProps = {
  tabs: Array<{
    label: string  | React.ReactNode;
    value: string;
    link?: string;
  }>;
  activeTab?: string;
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

const BaseTabs = ({
  tabs,
  activeTab = '0',
  orientation = 'horizontal',
  children
}:BaseTabsProps) => {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(activeTab);

  const isVertical = orientation === 'vertical';

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const handleTabClick = (e, link) => {
    history.push(link);
  }

  useEffect(() => {
    const path = history.location.pathname;
    const activeTab = tabs.find(tab => path.includes(tab.link));
    if (activeTab) {
      setValue(activeTab.value);
    }
  }, [history.location.pathname, tabs]);

  return (
    <div className={isVertical ? classes.root : ''}>
      <Tabs 
        value={value}
        onChange={handleChange}
        textColor='secondary'
        indicatorColor='secondary'
        orientation={orientation}
        className={isVertical ? classes.tabsVertical : classes.tabs}
      >
        {tabs.map((tab) => (
          <Tab 
            key={tab.value}
            label={
              tab.label
            }
            onClick={(e) => handleTabClick(e, tab.link)}
            value={tab.value} 
          />
        ))}
      </Tabs>
      <TabPanel>
        {children}
      </TabPanel>
    </div>
  );
}

export default BaseTabs;
