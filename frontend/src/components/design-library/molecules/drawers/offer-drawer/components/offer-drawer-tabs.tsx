import React, { useState } from 'react'
import { Tab, Tabs } from '@mui/material'

const OfferDrawerTabs = ({ tabs, onTabChange }) => {
  const [tabValue, setTabValue] = useState(0)

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
    onTabChange(newValue)
  }

  return (
    <>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
      >
        {tabs.map((tab) => (
          <Tab label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      {tabs.map((tab) => tab.value === tabValue && tab.component)}
    </>
  )
}

export default OfferDrawerTabs
