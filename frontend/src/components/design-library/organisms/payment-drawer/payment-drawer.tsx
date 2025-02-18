import React, { useState } from 'react'

import {
  Tabs,
  Tab,
  withStyles
} from '@material-ui/core'

import { Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '../../molecules/drawer/drawer'

import PickupTagList from '../../molecules/pickup-tag-list/pickup-tag-list'
import PricePlan from '../price-plan/price-plan'


const styles = (theme: Theme) =>
  createStyles({
    details: {
      display: 'flex',
      flexDirection: 'column'
    },
  });

type PaymentDrawerProps = {
  tabs: any;
  open: boolean;
  onClose: any;
  onChangePrice: any;
  plan?: any | undefined | null;
  title: any;
  pickupTagListMessagesPrimaryText: any;
  pickupTagListMessagesSecondaryText: any;
  classes: any;
}

const PaymentDrawer = ({ tabs, open, onClose, onChangePrice, plan, title, pickupTagListMessagesPrimaryText, pickupTagListMessagesSecondaryText, classes }: PaymentDrawerProps) => {
  const [tabValue, setTabValue] = useState(tabs.find(tab => tab.default)?.value)
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
    <Drawer
      open={open} onClose={onClose}
      title={title}
    >
      <PickupTagList
        primaryText={pickupTagListMessagesPrimaryText}
        secondaryText={pickupTagListMessagesSecondaryText}
        onPickItem={onPickItem}
      />
      <PricePlan plan={plan} price={price} onChange={onChangePrice} />
      <div>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          indicatorColor='secondary'
          textColor='secondary'
        >
          {tabs.map((tab) => <Tab label={tab.label} value={tab.value} />)}
        </Tabs>
        {tabs.map((tab) => tab.value === tabValue && tab.component)}
      </div>
    </Drawer >
  )
}

export default withStyles(styles)(PaymentDrawer)
