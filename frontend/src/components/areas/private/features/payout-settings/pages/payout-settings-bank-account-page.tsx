import React, { useEffect } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import PayoutSettingsBankAccount from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account/payout-settings-bank-account'
import PayoutSettingsBankAcccountHolderPage from './payout-settings-bank-account-holder-page'
import PayoutSettingsBankAccountInfoPageContainer from '../../../../../../containers/account/payout-settings/payouts-settings-bank-account-banks'
import PayoutSettingsBankAccountPayoutSchedulePage from './payout-settings-bank-account-payout-schedule-page'
import PayoutSettingsBankAccountVerificationPage from './payout-settings-bank-account-verification-page'
import PayoutSettingsBankAccountVerificationRefreshPage from './payout-settings-bank-account-verification-refresh-page'
import PayoutSettingsBankAccountVerificationReturnPage from './payout-settings-bank-account-verification-return-page'
import { getVerificationStatus, hasPlatformFillableRequirements } from 'design-library/pages/private-pages/settings-pages/payout-settings-bank-account-verification/payout-settings-bank-account-verification'

const PayoutSettingsBankAccountPage = ({
  user,
  account,
  countries,
  createAccount,
  updateAccount,
  deleteAccount,
  fetchAccount,
  fetchAccountCountries,
  fetchAccountVerificationLink
}) => {
  return (
    useEffect(() => {
      fetchAccount()
      fetchAccountCountries()
    }, [fetchAccount, fetchAccountCountries]),
    (
      <PayoutSettingsBankAccount
        user={user}
        onSaveCountry={createAccount}
        verificationStatus={account?.completed ? getVerificationStatus(account) : undefined}
        verificationTabDisabled={hasPlatformFillableRequirements(account)}
      >
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
            <Route
              exact
              path="/profile/payout-settings/bank-account/account-verification"
              component={(routeProps) => (
                <PayoutSettingsBankAccountVerificationPage
                  {...routeProps}
                  account={account}
                  fetchAccountVerificationLink={fetchAccountVerificationLink}
                />
              )}
            />
            <Route
              exact
              path="/profile/payout-settings/bank-account/account-verification/refresh"
              component={(routeProps) => (
                <PayoutSettingsBankAccountVerificationRefreshPage
                  {...routeProps}
                  account={account}
                  fetchAccountVerificationLink={fetchAccountVerificationLink}
                />
              )}
            />
            <Route
              exact
              path="/profile/payout-settings/bank-account/account-verification/return"
              component={(routeProps) => (
                <PayoutSettingsBankAccountVerificationReturnPage
                  {...routeProps}
                  account={account}
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
