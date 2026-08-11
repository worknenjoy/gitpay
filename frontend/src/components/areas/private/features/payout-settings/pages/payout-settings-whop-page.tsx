import React, { useEffect } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import PayoutSettingsWhop from 'design-library/pages/private-pages/settings-pages/payout-settings-whop/payout-settings-whop'
import WhopIdentityPanel from 'design-library/molecules/sections/whop-identity-panel/whop-identity-panel'
import WhopPayoutMethodPanel from 'design-library/molecules/sections/whop-payout-method-panel/whop-payout-method-panel'
import WhopScheduleBalancesPanel from 'design-library/molecules/sections/whop-schedule-balances-panel/whop-schedule-balances-panel'
import WhopRequirementsPanel from 'design-library/molecules/sections/whop-requirements-panel/whop-requirements-panel'
import WhopDisputesPanel from 'design-library/molecules/sections/whop-disputes-panel/whop-disputes-panel'

const WHOP_BASE = '/profile/payout-settings/whop'

type PayoutSettingsWhopPageProps = {
  user?: any
  account?: any
  fetchAccount?: () => void
  deleteAccount?: () => Promise<any> | void
  fetchAccountVerificationLink?: () => void
}

/**
 * Whop payout tab (feature layer): fetches the account, wires verification/manage/
 * disconnect actions, and routes the vertical sub-nav panels.
 */
const PayoutSettingsWhopPage = ({
  user,
  account,
  fetchAccount,
  deleteAccount,
  fetchAccountVerificationLink
}: PayoutSettingsWhopPageProps) => {
  useEffect(() => {
    if (fetchAccount) fetchAccount()
  }, [fetchAccount])

  const handleVerification = () => {
    if (fetchAccountVerificationLink) fetchAccountVerificationLink()
  }

  const handleDisconnect = async () => {
    if (deleteAccount) await deleteAccount()
    if (fetchAccount) fetchAccount()
  }

  return (
    <PayoutSettingsWhop
      account={account}
      onCompleteVerification={handleVerification}
      onManageOnWhop={handleVerification}
      onDisconnect={handleDisconnect}
    >
      <HashRouter>
        <Switch>
          <Route exact path={WHOP_BASE} render={() => <Redirect to={`${WHOP_BASE}/identity`} />} />
          <Route
            exact
            path={`${WHOP_BASE}/identity`}
            render={() => (
              <WhopIdentityPanel
                account={account}
                user={user}
                onManageOnWhop={handleVerification}
              />
            )}
          />
          <Route
            exact
            path={`${WHOP_BASE}/payout-method`}
            render={() => (
              <WhopPayoutMethodPanel account={account} onManageOnWhop={handleVerification} />
            )}
          />
          <Route
            exact
            path={`${WHOP_BASE}/schedule-balances`}
            render={() => (
              <WhopScheduleBalancesPanel account={account} onManageOnWhop={handleVerification} />
            )}
          />
          <Route
            exact
            path={`${WHOP_BASE}/requirements`}
            render={() => (
              <WhopRequirementsPanel account={account} onResolveOnWhop={handleVerification} />
            )}
          />
          <Route
            exact
            path={`${WHOP_BASE}/disputes`}
            render={() => <WhopDisputesPanel account={account} />}
          />
        </Switch>
      </HashRouter>
    </PayoutSettingsWhop>
  )
}

export default PayoutSettingsWhopPage
