import React, { useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

const useStyles = styled((theme: Theme) => ({
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
    alignItems: 'flex-end'
  },
  tabs: {
    flexDirection: 'column'
  },
  tab: {
    margin: 10,
    marginRight: 20
  },
  tabPanel: {
    width: '100%',
    marginTop: 20
  },
  tabPanelVertical: {
    marginTop: 0,
    width: '100%'
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  isVertical?: boolean;
  withCard?: boolean;
}

function TabPanel(props: TabPanelProps) {
  const classes = useStyles();
  const { children, isVertical, withCard = true } = props;

  return (
    <div
      role="tabpanel"
      className={isVertical ? classes.tabPanelVertical : classes.tabPanel}
    >  
      <Box p={0}>
        {withCard ? <Card className={classes.card} elevation={0}>
          <CardContent>
            {children}
          </CardContent>
        </Card> : children}
        
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
  onChange?: (event: React.ChangeEvent<{}>, newValue: string) => void;
  children: React.ReactNode;
  withCard?: boolean;
}

const BaseTabs = ({
  tabs,
  activeTab = '0',
  orientation = 'horizontal',
  onChange,
  withCard = true,
  children
}:BaseTabsProps) => {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(activeTab);

  const isVertical = orientation === 'vertical';

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(event, newValue);
    }
  }

  const handleTabClick = (e, tab) => {
    tab.link && history.push(tab.link);
    tab.onChange && tab.onChange(e, tab.value);
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
        textColor="secondary"
        indicatorColor="secondary"
        orientation={orientation}
        className={isVertical ? classes.tabsVertical : classes.tabs}
      >
        {tabs.map((tab) => (
          <Tab 
            key={tab.value}
            label={
              tab.label
            }
            onClick={(e) => handleTabClick(e, tab)}
            value={tab.value} 
          />
        ))}
      </Tabs>
      <TabPanel isVertical={isVertical} withCard={withCard}>
        {children}
      </TabPanel>
    </div>
  );
}

export default BaseTabs;
