import React, { useState, useEffect } from 'react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

import {
  Container,
  Tabs,
  Tab,
  Typography,
  Chip,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  Drawer,
  Grid
} from '@material-ui/core'

import { TaskPaymentPlans } from '../../../task/payment/plans/task-payment-plans'

const taskPaymentFormMessages = defineMessages({
  tabPaymentMethodCrediCard: {
    id: 'task.payment.method.card',
    defaultMessage: 'Credit Card'
  },
  tabPaymentMethodPaypal: {
    id: 'task.payment.method.paypal',
    defaultMessage: 'Paypal'
  },
  tabPaymentMethodInvoice: {
    id: 'task.payment.method.invoice',
    defaultMessage: 'Invoice'
  },
})

const fee = { 'open source': 1.08, 'private': 1.18, 'full': 1.30 }

const AddFundsFormDrawer = ({ classes, intl, open, onClose }) => {
  const [price, setPrice] = useState(0)
  const [plan, setPlan] = useState(null)
  const [tabValue, setTabValue] = useState('invoice')

  useEffect(() => {
    
  }, [])

  const formatCurrency = (amount) => {
    return (new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumSignificantDigits: 4
    }).format(amount))
  }

  const pickTaskPrice = (price) => {
    setPrice(price)
  }

  const handleInputChange = (e) => {
    setPrice(e.target.value)
  }

  const handlePayment = (value) => {
    props.openDialog(value)
  }

  const handlePlan = (plan) => {
    setPlan(plan)
  }

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const priceAfterFee = () => {
    return plan && Number((parseInt(price) * fee[plan]).toFixed(2))
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
            <FormattedMessage id='payment.addfunds.headline' defaultMessage='Add funds' />
          </Typography>
          <div className={classes.details}>
            <Typography variant='subtitle2'>
              <FormattedMessage id='payment.addfunds.headline.bounty.add' defaultMessage='Add a payment in advance and use it to pay for bounties' />
            </Typography>
            <Typography variant='body1' color='textSecondary' gutterBottom>
              <FormattedMessage id='issue.payment.form.message.subheading' defaultMessage='Create a bounty for this issue and who you assign will receive the payment for this bounty' />
            </Typography>
            <div className={classes.chipContainer}>
              <Chip
                label=' $ 20'
                className={classes.chip}
                onClick={() => pickTaskPrice(20)}
              />
              <Chip
                label=' $ 50'
                className={classes.chip}
                onClick={() => pickTaskPrice(50)}
              />
              <Chip
                label=' $ 100'
                className={classes.chip}
                onClick={() => pickTaskPrice(100)}
              />
              <Chip
                label=' $ 150'
                className={classes.chip}
                onClick={() => pickTaskPrice(150)}
              />
              <Chip
                label=' $ 300'
                className={classes.chip}
                onClick={() => pickTaskPrice(300)}
              />
            </div>
            <Grid container spacing={0}>
              <Grid spacing={0} xs={0} md={4} lg={4}>
                <form className={classes.formPayment} action='POST'>
                  <FormControl>
                    <InputLabel htmlFor='adornment-amount'>
                      <FormattedMessage id='task.payment.input.amount.value' defaultMessage='Price' />
                    </InputLabel>
                    <FormattedMessage id='task.payment.input.amount' defaultMessage='Price insert a value for this task' >
                      {(msg) => (
                        <Input
                          id='adornment-amount'
                          endAdornment={
                            <InputAdornment position='end'> + </InputAdornment>
                          }
                          startAdornment={
                            <InputAdornment position='start'>
                              <span style={{ fontSize: 28 }}> $ </span>
                            </InputAdornment>
                          }
                          placeholder={msg}
                          type='number'
                          inputProps={{ 'min': 0, style: { textAlign: 'right', height: 92 } }}
                          defaultValue={price}
                          value={price}
                          onChange={handleInputChange}
                          align='right'
                          style={{ fontSize: 42, fontWeight: 'bold' }}
                        />
                      )}
                    </FormattedMessage>
                  </FormControl>
                </form>
              </Grid>
              <Grid xs={0} md={8} lg={8}>
                <TaskPaymentPlans
                  classes={classes}
                  plan={plan}
                />
              </Grid>
            </Grid>
            <div>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                indicatorColor='secondary'
                textColor='secondary'
              >
                <Tab label={intl.formatMessage(taskPaymentFormMessages.tabPaymentMethodInvoice)} value='invoice' /> 
              </Tabs>
              {tabValue === 'invoice' &&
                <>invoice payment tab</>
              }
            </div>
          </div>
        </div>
      </Container>
    </Drawer>
  )
}

export default injectIntl(AddFundsFormDrawer)
