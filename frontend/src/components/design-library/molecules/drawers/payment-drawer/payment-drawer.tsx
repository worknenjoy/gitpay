import React, { useState } from 'react'

import { Tabs, Tab } from '@mui/material'

import { styled } from '@mui/material/styles'
import Drawer from '../drawer/drawer'

import PickupTagList from '../../lists/pickup-tag-list/pickup-tag-list'
import PricePlan from '../../../organisms/forms/price-forms/price-plan-form/price-plan'

const Details = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
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
  classes,
}: PaymentDrawerProps) => {
  const [tabValue, setTabValue] = useState(tabs.find((tab) => tab.default)?.value)
  const [price, setPrice] = useState(0)

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
          {tabs.map((tab) => (
            <Tab label={tab.label} value={tab.value} />
          ))}
        </Tabs>
        {tabs.map((tab) => tab.value === tabValue && tab.component)}
      </Details>
    </Drawer>
  )
}

export default PaymentDrawer
