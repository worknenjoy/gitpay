import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import ProfileHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header'
import PayoutSettings from 'design-library/pages/private-pages/settings-pages/payout-settings/payout-settings'
import PayoutSettingsBankAccountContainer from '../../../../../../containers/account/payout-settings/payouts-settings-bank-account'
import PayoutSettingsPaypalContainer from '../../../../../../containers/account/payout-settings/payout-settings-paypal'
import { FormattedMessage } from 'react-intl'

const PayoutSettingsPage = () => {
  return (
    <>
      <ProfileHeader
        title={<FormattedMessage id="payoutSettings.title" defaultMessage="Payout Settings" />}
        subtitle={
          <FormattedMessage
            id="payoutSettings.subtitle"
            defaultMessage="Manage your payout settings and payment methods."
          />
        }
      />
      <PayoutSettings>
        <HashRouter>
          <Switch>
            <Route
              exact
              path="/profile/payout-settings"
              component={() => <Redirect to="/profile/payout-settings/bank-account" />}
            />
            <Route
              path="/profile/payout-settings/bank-account"
              component={PayoutSettingsBankAccountContainer}
            />
            <Route
              exact
              path="/profile/payout-settings/paypal"
              component={PayoutSettingsPaypalContainer}
            />
          </Switch>
        </HashRouter>
      </PayoutSettings>
    </>
  )
}
export default PayoutSettingsPage
