import React, { useEffect } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import PayoutSettingsBankAccount from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account/payout-settings-bank-account'
import PayoutSettingsBankAcccountHolderPage from './payout-settings-bank-account-holder-page'
import PayoutSettingsBankAccountInfoPageContainer from '../../../../../../containers/account/payout-settings/payouts-settings-bank-account-banks'
import PayoutSettingsBankAccountPayoutSchedulePage from './payout-settings-bank-account-payout-schedule-page'

const PayoutSettingsBankAccountPage = ({
  user,
  account,
  countries,
  createAccount,
  updateAccount,
  deleteAccount,
  fetchAccount,
  fetchAccountCountries
}) => {
  return (
    useEffect(() => {
      fetchAccount()
      fetchAccountCountries()
    }, [fetchAccount, fetchAccountCountries]),
    (
      <PayoutSettingsBankAccount user={user} onSaveCountry={createAccount}>
        <HashRouter>
          <Switch>
            <Route
              exact
              path="/profile/payout-settings/bank-account"
              component={() => (
                <Redirect to="/profile/payout-settings/bank-account/account-holder" />
              )}
            />
            <Route
              exact
              path="/profile/payout-settings/bank-account/account-holder"
              component={(routeProps) => (
                <PayoutSettingsBankAcccountHolderPage
                  {...routeProps}
                  user={user}
                  updateAccount={updateAccount}
                  deleteAccount={deleteAccount}
                  fetchAccountCountries={fetchAccountCountries}
                  account={account}
                  countries={countries}
                />
              )}
            />
            <Route
              exact
              path="/profile/payout-settings/bank-account/bank-account-info"
              component={PayoutSettingsBankAccountInfoPageContainer}
            />
            <Route
              exact
              path="/profile/payout-settings/bank-account/payout-schedule"
              component={(routeProps) => (
                <PayoutSettingsBankAccountPayoutSchedulePage
                  {...routeProps}
                  account={account}
                  updateAccount={updateAccount}
                />
              )}
            />
          </Switch>
        </HashRouter>
      </PayoutSettingsBankAccount>
    )
  )
}
export default PayoutSettingsBankAccountPage
