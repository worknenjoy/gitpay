import React, { useEffect } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import PayoutSettingsBankAccount from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account/payout-settings-bank-account'
import PayoutSettingsBankAcccountHolderPage from './payout-settings-bank-account-holder-page'
import PayoutSettingsBankAccountInfoPage from './payout-settings-bank-account-info-page'
import PayoutSettingsBankAccountPayoutSchedulePage from './payout-settings-bank-account-payout-schedule-page'

const PayoutSettingsBankAccountPage = ({
  user,
  account,
  bankAccount,
  countries,
  createAccount,
  updateAccount,
  deleteAccount,
  fetchAccount,
  fetchAccountCountries,
  getBankAccount,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount
}) => {
  return (
    useEffect(() => {
      fetchAccount()
      getBankAccount()
      fetchAccountCountries()
    }, [fetchAccount, getBankAccount, fetchAccountCountries]),
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
              component={(routeProps) => (
                <PayoutSettingsBankAccountInfoPage
                  {...routeProps}
                  user={user}
                  bankAccount={bankAccount}
                  createBankAccount={createBankAccount}
                  updateBankAccount={updateBankAccount}
                  deleteBankAccount={deleteBankAccount}
                  getBankAccount={getBankAccount}
                  countries={countries}
                />
              )}
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
