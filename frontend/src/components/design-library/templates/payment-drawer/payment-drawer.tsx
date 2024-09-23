import React, { useState } from 'react'

import {
  Container,
  Tabs,
  Tab,
  Typography,
  Drawer,
  withStyles
} from '@material-ui/core'

import { Theme, createStyles } from '@material-ui/core/styles';

import PickupTagList from '../../molecules/pickup-tag-list/pickup-tag-list' 
import PricePlan from '../../organisms/price-plan/price-plan'

const tags = [
  {
    id: 1,
    name: '$ 20',
    value: 20
  },
  {
    id: 2,
    name: '$ 50',
    value: 50
  },
  {
    id: 3,
    name: '$ 100',
    value: 100
  },
  {
    id: 4,
    name: '$ 150',
    value: 150
  },
  {
    id: 5,
    name: '$ 300',
    value: 300
  }
]


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

const PaymentDrawer = ({ tabs, open, onClose, onChangePrice, plan, title, pickupTagListMessagesPrimaryText, pickupTagListMessagesSecondaryText, classes }:PaymentDrawerProps) => {
  const [tabValue, setTabValue] = useState(tabs.find(tab => tab.default)?.value)
  const [ price, setPrice ] = useState(0)

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
      aria-labelledby='form-dialog-title'
      anchor='right'
    >
      <Container>
        <div style={{ padding: 20 }}>
          <Typography variant='h5' id='form-dialog-title' gutterBottom>
            {title}
          </Typography>
          <div className={classes.details}>
            <PickupTagList
              tags={tags}
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
                { tabs.map((tab) => <Tab label={tab.label} value={tab.value} /> )}
              </Tabs>
              { tabs.map((tab) => tab.value === tabValue && tab.component) }
            </div>
          </div>
        </div>
      </Container>
    </Drawer>
  )
}

export default withStyles(styles)(PaymentDrawer)
