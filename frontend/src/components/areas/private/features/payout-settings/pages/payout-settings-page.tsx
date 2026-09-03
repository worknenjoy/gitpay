import React, { useEffect, useState } from 'react'
import { HashRouter, Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { Box, Paper } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import ProfileHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header'
import PayoutSettings from 'design-library/pages/private-pages/settings-pages/payout-settings/payout-settings'
import PayoutProviderSelector from 'design-library/molecules/sections/payout-provider-selector/payout-provider-selector'
import DocsAlert from 'design-library/atoms/alerts/docs-alert/docs-alert'
import ConfirmDialog from 'design-library/molecules/dialogs/confirm-dialog/confirm-dialog'
import PayoutSettingsWhopContainer from '../../../../../../containers/account/payout-settings/payout-settings-whop'
import PayoutSettingsBankAccountContainer from '../../../../../../containers/account/payout-settings/payouts-settings-bank-account'
import PayoutSettingsPaypalContainer from '../../../../../../containers/account/payout-settings/payout-settings-paypal'

const WHOP_PAYOUT_GUIDE_URL = 'https://docs.gitpay.me/docs/en/whop-payout-setup/'

type PayoutSettingsPageProps = {
  user?: any
  account?: any
  createAccount?: (country?: string, confirmExistingAccountId?: string) => Promise<any> | void
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
  const [existingWhopAccount, setExistingWhopAccount] = useState<{
    id: string
    title: string
  } | null>(null)

  useEffect(() => {
    if (fetchAccount) fetchAccount()
    if (fetchAccountCountries) fetchAccountCountries()
  }, [fetchAccount, fetchAccountCountries])

  const handleCreateWhopAccount = async () => {
    if (!createAccount) return
    const result: any = await createAccount()
    const conflict = result?.error
    if (conflict?.requiresConfirmation) {
      setExistingWhopAccount({
        id: conflict.existingAccountId,
        title: conflict.existingAccountTitle
      })
      return
    }
    if (conflict) return // stay on the creation screen; notification already shown
    history.push('/profile/payout-settings/whop')
  }

  const handleConfirmExistingWhopAccount = async () => {
    if (!createAccount || !existingWhopAccount) return
    const result: any = await createAccount(undefined, existingWhopAccount.id)
    setExistingWhopAccount(null)
    if (result?.error) return
    history.push('/profile/payout-settings/whop')
  }

  return (
    <>
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
                  onCreateAccount={handleCreateWhopAccount}
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
      <ConfirmDialog
        open={Boolean(existingWhopAccount)}
        handleClose={() => setExistingWhopAccount(null)}
        onConfirm={handleConfirmExistingWhopAccount}
        onCancel={() => setExistingWhopAccount(null)}
        confirmLabel={
          <FormattedMessage
            id="payoutSettings.whop.existingAccount.confirm"
            defaultMessage="Link account"
          />
        }
        cancelLabel={
          <FormattedMessage
            id="payoutSettings.whop.existingAccount.cancel"
            defaultMessage="Cancel"
          />
        }
        message={
          <FormattedMessage
            id="payoutSettings.whop.existingAccount.message"
            defaultMessage="We found an existing Whop account ({title}) already associated with your verified email. Do you want to link it to your Gitpay account?"
            values={{ title: existingWhopAccount?.title }}
          />
        }
      />
    </>
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
        aside={
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <DocsAlert
              docsUrl={WHOP_PAYOUT_GUIDE_URL}
              text={
                <FormattedMessage
                  id="payout-settings.whop.guide.text"
                  defaultMessage="New to Whop payouts?"
                />
              }
              linkLabel={
                <FormattedMessage
                  id="payout-settings.whop.guide.link"
                  defaultMessage="Read the guide"
                />
              }
            />
          </Box>
        }
      />
      <HashRouter>
        <PayoutSettingsRoutes {...props} />
      </HashRouter>
    </>
  )
}

export default PayoutSettingsPage
