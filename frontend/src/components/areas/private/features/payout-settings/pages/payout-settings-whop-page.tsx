import React, { useEffect } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import PayoutSettingsWhop from 'design-library/pages/private-pages/settings-pages/payout-settings-whop/payout-settings-whop'
import WhopIdentityPanel from 'design-library/molecules/sections/whop-identity-panel/whop-identity-panel'
import WhopPayoutMethodPanel from 'design-library/molecules/sections/whop-payout-method-panel/whop-payout-method-panel'
import WhopScheduleBalancesPanel from 'design-library/molecules/sections/whop-schedule-balances-panel/whop-schedule-balances-panel'
import WhopDisputesPanel from 'design-library/molecules/sections/whop-disputes-panel/whop-disputes-panel'
import WhopAccountVerificationReturnPage from './payout-settings-whop-verification-return-page'

const WHOP_BASE = '/profile/payout-settings/whop'

type PayoutSettingsWhopPageProps = {
  user?: any
  account?: any
  countries?: any
  fetchAccount?: () => void
  fetchAccountCountries?: () => void
  deleteAccount?: () => Promise<any> | void
  fetchAccountVerificationLink?: (purpose?: string) => void
  addNotification?: (message: string, options: { severity: string; extra?: string }) => void
}

/**
 * Whop payout tab (feature layer): fetches the account, wires verification/manage/
 * disconnect actions, and routes the vertical sub-nav panels.
 */
const PayoutSettingsWhopPage = ({
  user,
  account,
  countries,
  fetchAccount,
  fetchAccountCountries,
  deleteAccount,
  fetchAccountVerificationLink,
  addNotification
}: PayoutSettingsWhopPageProps) => {
  useEffect(() => {
    if (fetchAccount) fetchAccount()
    if (fetchAccountCountries) fetchAccountCountries()
  }, [fetchAccount, fetchAccountCountries])

  // 'identity' → Whop's KYC-only account link; 'payout' → the fuller hosted portal
  // (withdrawals, payout methods, and identity) — see createUserAccountLink.ts.
  const handleVerification = (purpose?: string) => () => {
    if (fetchAccountVerificationLink) fetchAccountVerificationLink(purpose)
  }

  const handleDisconnect = async () => {
    if (deleteAccount) await deleteAccount()
    if (fetchAccount) fetchAccount()
  }

  return (
    <PayoutSettingsWhop
      account={account}
      onManageOnWhop={handleVerification('payout')}
      onDisconnect={handleDisconnect}
    >
      <HashRouter>
        <Switch>
          <Route exact path={WHOP_BASE} render={() => <Redirect to={`${WHOP_BASE}/identity`} />} />
          <Route
            exact
            path={`${WHOP_BASE}/requirements`}
            render={() => <Redirect to={`${WHOP_BASE}/identity`} />}
          />
          <Route
            exact
            path={`${WHOP_BASE}/identity`}
            render={() => (
              <WhopIdentityPanel
                account={account}
                user={user}
                countries={countries}
                onManageOnWhop={handleVerification('identity')}
              />
            )}
          />
          <Route
            exact
            path={`${WHOP_BASE}/payout-method`}
            render={() => (
              <WhopPayoutMethodPanel account={account} onManageOnWhop={handleVerification('payout')} />
            )}
          />
          <Route
            exact
            path={`${WHOP_BASE}/schedule-balances`}
            render={() => (
              <WhopScheduleBalancesPanel
                account={account}
                onManageOnWhop={handleVerification('payout')}
              />
            )}
          />
          <Route
            exact
            path={`${WHOP_BASE}/disputes`}
            render={() => <WhopDisputesPanel account={account} />}
          />
          <Route
            exact
            path={`${WHOP_BASE}/account-verification/return`}
            render={() => (
              <WhopAccountVerificationReturnPage
                outcome="return"
                fetchAccount={fetchAccount}
                fetchAccountCountries={fetchAccountCountries}
                addNotification={addNotification}
              />
            )}
          />
          <Route
            exact
            path={`${WHOP_BASE}/account-verification/refresh`}
            render={() => (
              <WhopAccountVerificationReturnPage
                outcome="refresh"
                fetchAccount={fetchAccount}
                fetchAccountCountries={fetchAccountCountries}
                addNotification={addNotification}
              />
            )}
          />
        </Switch>
      </HashRouter>
    </PayoutSettingsWhop>
  )
}

export default PayoutSettingsWhopPage
