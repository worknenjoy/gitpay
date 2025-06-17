import React, { useEffect } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import PayoutSettingsBankAccount from '../../../../../design-library/pages/private/payout-settings-bank-account/payout-settings-bank-account'
import PayoutSettingsBankAcccountHolderPage from './payout-settings-bank-account-holder-page'
import PayoutSettingsBankAccountInfoPage from './payout-settings-bank-account-info-page'


const PayoutSettingsBankAccountPage = ({ 
  user,
  account,
  bankAccount,
  countries,
  createAccount,
  updateAccount,
  fetchAccount,
  fetchAccountCountries,
  getBankAccount,
  createBankAccount,
  updateBankAccount
}) => {
  return (

    useEffect(() => {
      fetchAccount();
      getBankAccount();
      fetchAccountCountries();
    }, [fetchAccount, getBankAccount, fetchAccountCountries]),

    <PayoutSettingsBankAccount
      user={user}
      onSaveCountry={createAccount}
    >
      <HashRouter>
        <Switch>
          <Route exact path="/profile/payout-settings/bank-account" component={() => <Redirect to="/profile/payout-settings/bank-account/account-holder" />} />
          <Route
            exact
            path="/profile/payout-settings/bank-account/account-holder"
            component={(routeProps) => 
              <PayoutSettingsBankAcccountHolderPage 
                {...routeProps}
                user={user}
                updateAccount={updateAccount}
                fetchAccountCountries={fetchAccountCountries}
                account={account}
                countries={countries}
              />
            }
          />
          <Route 
            exact
            path="/profile/payout-settings/bank-account/bank-account-info"
            component={(routeProps) =>
              <PayoutSettingsBankAccountInfoPage
                {...routeProps}
                user={user}
                bankAccount={bankAccount}
                createBankAccount={createBankAccount}
                updateBankAccount={updateBankAccount}
                countries={countries}
              />} 
          />
        </Switch>
      </HashRouter>
    </PayoutSettingsBankAccount>

  );
}
export default PayoutSettingsBankAccountPage;