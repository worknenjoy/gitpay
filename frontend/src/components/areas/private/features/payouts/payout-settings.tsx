import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, Tab, Tabs, Box, Typography } from '@material-ui/core';
import messages from '../../shared/messages'
import BankAccountSettings from './bank-account-settings';
import PaypalSettings from './paypal-settings';
import Alert from '../../../../design-library/atoms/alerts/alert/alert';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 160,
    alignItems: 'flex-end'
  },
  tab: {
    margin: 10,
    marginRight: 20
  },
  tabPanel: {
    width: '100%'
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
      <Box p={2}>
        {children}
      </Box>
    </div>
  );
}

const PayoutSettings = ({
  intl,
  user,
  account,
  countries,
  createAccount,
  updateAccount,
  bankAccount,
  createBankAccount,
  updateBankAccount,
  getBankAccount,
  fetchAccount,
  fetchAccountCountries,
  updateUser,
  deleteUser,
  changePassword,
  addNotification
}) => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = React.useState('bank');
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  }
  return (
    <Paper elevation={1} style={{ padding: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Typography variant='h6' gutterBottom>
            <FormattedMessage id='account.payout.settings.title' defaultMessage='Payout settings' />
          </Typography>
          <Typography variant='body2' gutterBottom>
            <FormattedMessage id='account.payout.settings.description' defaultMessage='Manage your payout settings' />
          </Typography>
            <Alert severity='info' dismissable={true} alertKey={'payout-settings-guidelines-message'}>
              <FormattedMessage id='account.payout.settings.alert.part1' defaultMessage='Your payout will be processed according to the payment method used for the bounty. Please review the following guidelines:' />
              <br />
              <br />
              <FormattedMessage id='account.payout.settings.alert.part2' defaultMessage='- Credit Card or Invoice Payments: If the bounty was paid via credit card or invoice, your payout will be sent directly to your registered bank account.' />
              <br />
              <FormattedMessage id='account.payout.settings.alert.part3' defaultMessage='- PayPal Payments: If the bounty was paid using PayPal, the payout will be sent to your linked PayPal account.' />
              <br />
              <FormattedMessage id='account.payout.settings.alert.part4' defaultMessage='- Multiple Payments: In cases where a bounty has been paid through multiple methods, you will receive separate payouts according to each payment method used. For instance, amounts paid via credit card will go to your bank account, while amounts paid via PayPal will be sent to your PayPal account.' />
              <br />
              <br />
              <FormattedMessage id='account.payout.settings.alert.part5' defaultMessage='Please ensure that your payout settings are up to date to facilitate smooth transactions.' />
            </Alert>
        </Grid>
        <Grid item xs={12} md={12}>
          <div className={classes.root}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons='on'
              indicatorColor='secondary'
              textColor='secondary'
              orientation='vertical'
              className={classes.tabs}
            >
              <Tab className={classes.tab} value={'bank'} label={intl.formatMessage(messages.cardTab)} />
              <Tab className={classes.tab} value={'paypal'} label={intl.formatMessage(messages.paypalTab)} />
            </Tabs>
            { currentTab === 'bank' && 
              <TabPanel>
                <BankAccountSettings
                  user={user}
                  account={account}
                  countries={countries}
                  fetchAccount={fetchAccount}
                  updateUser={updateUser}
                  deleteUser={deleteUser}
                  changePassword={changePassword}
                  addNotification={addNotification}
                  createAccount={createAccount}
                  updateAccount={updateAccount}
                  bankAccount={bankAccount}
                  createBankAccount={createBankAccount}
                  updateBankAccount={updateBankAccount}
                  getBankAccount={getBankAccount}
                  fetchAccountCountries={fetchAccountCountries}
                />
              </TabPanel>}
            { currentTab === 'paypal' && 
              <TabPanel>
                <PaypalSettings user={user} updateUser={updateUser} />
              </TabPanel>
            }
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default injectIntl(PayoutSettings);