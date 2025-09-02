import React, { useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  CardContent
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import {
  StyledCard,
  StyledTabsVertical
} from './base-tabs.styles'

interface TabPanelProps {
  children?: React.ReactNode;
  isVertical?: boolean;
  withCard?: boolean;
}

function TabPanel(props: TabPanelProps) {
  const { children, isVertical, withCard = true } = props;

  return (
    <div role="tabpanel">
      <Box p={0}>
        {withCard ? (
          <StyledCard elevation={0}>
            <CardContent>
              {children}
            </CardContent>
          </StyledCard>
        ) : children}

      </Box>
    </div>
  );
}

type BaseTabsProps = {
  tabs: Array<{
    label: string | React.ReactNode;
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
}: BaseTabsProps) => {
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
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        orientation={orientation}
        {...(isVertical ? { component: StyledTabsVertical as any } : {})}
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
