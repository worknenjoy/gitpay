import React, { useEffect } from 'react'
import { Tabs, Tab, Box, CardContent, useTheme, useMediaQuery } from '@mui/material'
import { useHistory } from 'react-router-dom'
import {
  Root,
  StyledCard,
  StyledTabsColumn,
  StyledTabsVertical,
  TabPanelRoot,
  TabPanelVertical
} from './base-tabs.styles'

interface TabPanelProps {
  children?: React.ReactNode
  isVertical?: boolean
  withCard?: boolean
  value?: string
}

function TabPanel(props: TabPanelProps) {
  const { children, value, isVertical, withCard = true, ...other } = props

  const Comp = isVertical ? TabPanelVertical : TabPanelRoot

  return (
    <Comp role="tabpanel" {...other}>
      <Box p={0}>
        {withCard ? (
          <StyledCard elevation={0}>
            <CardContent>{children}</CardContent>
          </StyledCard>
        ) : (
          children
        )}
      </Box>
    </Comp>
  )
}

type BaseTabsProps = {
  tabs: Array<{
    label: string | React.ReactNode
    value: string | number
    link?: string
  }>
  activeTab?: string | number
  orientation?: 'horizontal' | 'vertical'
  onChange?: (event: React.SyntheticEvent, newValue: string | number) => void
  children: React.ReactNode
  withCard?: boolean
}

const BaseTabs = ({
  tabs,
  activeTab = 0,
  orientation = 'horizontal',
  onChange,
  withCard = true,
  children
}: BaseTabsProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const history = useHistory()
  const [value, setValue] = React.useState(activeTab)

  const isVertical = orientation === 'vertical' && !isMobile

  const handleChange = (event: React.SyntheticEvent, newValue: string | number) => {
    setValue(newValue)
    onChange?.(event, newValue)
  }

  const handleTabClick = (e, tab) => {
    tab.link && history.push(tab.link)
    tab.onChange && tab.onChange(e, tab.value)
  }

  useEffect(() => {
    const path = history.location.pathname
    const activeTab = tabs.find((tab) => path.includes(tab.link))
    if (activeTab) {
      setValue(activeTab.value)
    }
  }, [history.location.pathname, tabs])

  const RootComp = isVertical ? Root : 'div'
  const TabWrapper = isVertical ? StyledTabsVertical : StyledTabsColumn

  return (
    <RootComp>
      <TabWrapper>
        <Tabs
          value={value || 0}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          orientation={isMobile ? 'horizontal' : orientation}
          variant={isVertical ? 'standard' : 'scrollable'}
          scrollButtons={isVertical ? false : 'auto'}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              onClick={(e) => handleTabClick(e, tab)}
              value={tab.value}
            />
          ))}
        </Tabs>
      </TabWrapper>
      <TabPanel isVertical={isVertical} withCard={withCard}>
        {children}
      </TabPanel>
    </RootComp>
  )
}

export default BaseTabs
