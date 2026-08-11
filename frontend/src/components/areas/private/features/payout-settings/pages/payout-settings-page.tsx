import React, { useEffect } from 'react'
import { HashRouter, Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { Paper } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import ProfileHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header'
import PayoutSettings from 'design-library/pages/private-pages/settings-pages/payout-settings/payout-settings'
import PayoutProviderSelector from 'design-library/molecules/sections/payout-provider-selector/payout-provider-selector'
import PayoutSettingsWhopContainer from '../../../../../../containers/account/payout-settings/payout-settings-whop'
import PayoutSettingsBankAccountContainer from '../../../../../../containers/account/payout-settings/payouts-settings-bank-account'
import PayoutSettingsPaypalContainer from '../../../../../../containers/account/payout-settings/payout-settings-paypal'

type PayoutSettingsPageProps = {
  user?: any
  account?: any
  createAccount?: (country: string) => Promise<any> | void
  fetchAccount?: () => void
  fetchAccountCountries?: () => void
}

const PayoutSettingsRoutes = ({
  user,
  account,
  createAccount,
  fetchAccount,
  fetchAccountCountries
}: PayoutSettingsPageProps) => {
  const history = useHistory()
  const data = user?.data || {}
  const hasWhop =
    Boolean(data.whop_account_id) ||
    (account?.data?.provider === 'whop' && Boolean(account?.data?.id))
  const hasStripe = Boolean(data.account_id)
  const hasPaypal = Boolean(data.paypal_id)
  const completed = user?.completed !== false

  useEffect(() => {
    if (fetchAccount) fetchAccount()
    if (fetchAccountCountries) fetchAccountCountries()
  }, [fetchAccount, fetchAccountCountries])

  const handleSaveCountry = async (country: string) => {
    if (createAccount) await createAccount(country)
    history.push('/profile/payout-settings/whop')
  }

  return (
    <Switch>
      <Route
        exact
        path="/profile/payout-settings"
        render={() =>
          hasWhop ? (
            <Redirect to="/profile/payout-settings/whop" />
          ) : (
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
              <PayoutProviderSelector
                completed={completed}
                hasStripeAccount={hasStripe}
                hasPaypalAccount={hasPaypal}
                onSaveCountry={handleSaveCountry}
                onAccessStripe={() => history.push('/profile/payout-settings/bank-account')}
                onAccessPaypal={() => history.push('/profile/payout-settings/paypal')}
              />
            </Paper>
          )
        }
      />
      <Route
        path="/profile/payout-settings/whop"
        render={() => (
          <PayoutSettings
            activeTab="whop"
            hasStripeAccount={hasStripe}
            hasPaypalAccount={hasPaypal}
          >
            <PayoutSettingsWhopContainer />
          </PayoutSettings>
        )}
      />
      <Route
        path="/profile/payout-settings/bank-account"
        render={() => (
          <PayoutSettings
            activeTab="stripe"
            hasStripeAccount={hasStripe}
            hasPaypalAccount={hasPaypal}
          >
            <PayoutSettingsBankAccountContainer />
          </PayoutSettings>
        )}
      />
      <Route
        exact
        path="/profile/payout-settings/paypal"
        render={() => (
          <PayoutSettings
            activeTab="paypal"
            hasStripeAccount={hasStripe}
            hasPaypalAccount={hasPaypal}
          >
            <PayoutSettingsPaypalContainer />
          </PayoutSettings>
        )}
      />
    </Switch>
  )
}

const PayoutSettingsPage = (props: PayoutSettingsPageProps) => {
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
      <HashRouter>
        <PayoutSettingsRoutes {...props} />
      </HashRouter>
    </>
  )
}

export default PayoutSettingsPage
