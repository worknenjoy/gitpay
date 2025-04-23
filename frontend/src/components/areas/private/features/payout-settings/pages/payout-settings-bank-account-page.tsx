import React from 'react';
import PayoutSettingsBankAccount from '../../../../../design-library/pages/private/payout-settings-bank-account/payout-settings-bank-account'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';


const PayoutSettingsBankAccountPage = ({ user, createAccount }) => {
  return (
    <PayoutSettingsBankAccount
      user={user}
      onSaveCountry={createAccount}
    >
      <HashRouter>
        <Switch>
          <Route exact path='/profile/payout-settings/bank-account' component={() => <Redirect to='/profile/payout-settings/bank-account/account-holder' />} />
          <Route exact path='/profile/payout-settings/bank-account/account-holder' component={() => <></>} />
          <Route exact path='/profile/payout-settings/bank-account/bank-account-info' component={() => <></>} />
        </Switch>
      </HashRouter>
    </PayoutSettingsBankAccount>
  );
}
export default PayoutSettingsBankAccountPage;