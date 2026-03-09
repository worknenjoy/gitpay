import React, { useEffect, useState } from 'react'

import { Tabs, Tab, Tooltip } from '@mui/material'

import { styled } from '@mui/material/styles'
import Drawer from '../drawer/drawer'

import PickupTagList from '../../lists/pickup-tag-list/pickup-tag-list'
import PricePlan from '../../../organisms/forms/price-forms/price-plan-form/price-plan'

const Details = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column'
}))

type PaymentDrawerProps = {
  tabs: any
  open: boolean
  onClose: any
  onChangePrice: any
  plan?: any | undefined | null
  title: any
  pickupTagListMessagesPrimaryText: any
  pickupTagListMessagesSecondaryText: any
  classes?: any
}

const PaymentDrawer = ({
  tabs,
  open,
  onClose,
  onChangePrice,
  plan,
  title,
  pickupTagListMessagesPrimaryText,
  pickupTagListMessagesSecondaryText,
  classes
}: PaymentDrawerProps) => {
  const getFirstEnabledTabValue = () => {
    const defaultEnabled = tabs.find((tab) => tab.default && !tab.disabled)
    if (defaultEnabled) return defaultEnabled.value

    const firstEnabled = tabs.find((tab) => !tab.disabled)
    return firstEnabled?.value
  }

  const [tabValue, setTabValue] = useState(getFirstEnabledTabValue())
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const currentTab = tabs.find((t) => t.value === tabValue)
    if (currentTab?.disabled) {
      setTabValue(getFirstEnabledTabValue())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs])

  const pickTaskPrice = (price) => {
    setPrice(price)
  }

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const onPickItem = (item) => {
    pickTaskPrice(item)
  }

  return (
    <Drawer open={open} onClose={onClose} title={title}>
      <PickupTagList
        primaryText={pickupTagListMessagesPrimaryText}
        secondaryText={pickupTagListMessagesSecondaryText}
        onPickItem={onPickItem}
      />
      <PricePlan plan={plan} price={price} onChange={onChangePrice} />
      <Details>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
        >
          {tabs.map((tab) => {
            const tabElement = (
              <Tab label={tab.label} value={tab.value} disabled={tab.disabled} />
            )

            if (!tab.tooltip) return tabElement

            // Tooltip doesn't fire on disabled elements, so wrap in a span.
            return (
              <Tooltip key={tab.value} title={tab.tooltip} placement="top">
                <span>{tabElement}</span>
              </Tooltip>
            )
          })}
        </Tabs>
        {tabs.map((tab) => tab.value === tabValue && tab.component)}
      </Details>
    </Drawer>
  )
}

export default PaymentDrawer
