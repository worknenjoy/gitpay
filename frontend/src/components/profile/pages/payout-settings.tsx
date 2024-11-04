import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, Tab, Tabs, Box, Typography } from '@material-ui/core';
import messages from '../messages'
import BankAccountSettings from '../components/payments/payouts/bank-account-settings';
import PaypalSettings from '../components/payments/payouts/paypal-settings';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 180,
    alignItems: 'flex-end'
  },
  tab: {
    margin: 10,
    marginRight: 20
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
  createAccount,
  bankAccount,
  createBankAccount,
  updateBankAccount,
  fetchAccount,
  updateUser,
  deleteUser,
  changePassword,
  addNotification,
  history,
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
        </Grid>
        <Grid item xs={12} md={12}>
          <div className={classes.root}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons='on'
              indicatorColor='primary'
              textColor='primary'
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
                  fetchAccount={fetchAccount}
                  updateUser={updateUser}
                  deleteUser={deleteUser}
                  changePassword={changePassword}
                  addNotification={addNotification}
                  createAccount={createAccount}
                  bankAccount={bankAccount}
                  createBankAccount={createBankAccount}
                  updateBankAccount={updateBankAccount}
                />
              </TabPanel>}
            { currentTab === 'paypal' && 
              <TabPanel>
                <PaypalSettings user={user} updateUser={updateUser} />
              </TabPanel>}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default injectIntl(PayoutSettings);