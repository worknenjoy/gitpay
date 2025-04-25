import React, { useEffect } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import PayoutSettingsBankAccount from '../../../../../design-library/pages/private/payout-settings-bank-account/payout-settings-bank-account'
import PayoutSettingsBankAcccountHolderPage from './payout-settings-bank-account-holder-page'


const PayoutSettingsBankAccountPage = ({ 
  user,
  account,
  countries,
  createAccount,
  updateAccount,
  fetchAccount,
  fetchAccountCountries
}) => {
  return (

    useEffect(() => {
      fetchAccount();
      fetchAccountCountries();
    }, [fetchAccount, fetchAccountCountries]),

    <PayoutSettingsBankAccount
      user={user}
      onSaveCountry={createAccount}
    >
      <HashRouter>
        <Switch>
          <Route exact path='/profile/payout-settings/bank-account' component={() => <Redirect to='/profile/payout-settings/bank-account/account-holder' />} />
          <Route
            exact
            path='/profile/payout-settings/bank-account/account-holder'
            component={(routeProps) => 
              <PayoutSettingsBankAcccountHolderPage 
                {...routeProps}
                user={user}
                fetchAccount={fetchAccount}
                updateAccount={updateAccount}
                fetchAccountCountries={fetchAccountCountries}
                account={account}
                countries={countries} />
            }
          />
          <Route exact path='/profile/payout-settings/bank-account/bank-account-info' component={() => <></>} />
        </Switch>
      </HashRouter>
    </PayoutSettingsBankAccount>

  );
}
export default PayoutSettingsBankAccountPage;