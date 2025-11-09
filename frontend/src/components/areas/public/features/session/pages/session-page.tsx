import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import SignupSigninPage from 'design-library/templates/base/signup-signin-base/signup-signin-base';
import Session from '../components/session';
import AccountActivation from '../../../../../../containers/account-activation'
import LoginPageContainer from '../../../../../../containers/login-page'
import RegisterPageContainer from '../../../../../../containers/register-page'

const SessionPage = () => {
  return (
    <SignupSigninPage>
      <HashRouter>
        <Switch>
          <Route exact path="/signin" component={ LoginPageContainer } />
          <Route exact path="/signin/:status" component={ LoginPageContainer } />
          <Route exact path="/signup" component={ RegisterPageContainer } />
          <Route exact path="/reset-password/:token" component={ LoginPageContainer } />
          <Route exact path="/token/:token" component={ Session } />
          <Route exact path="/activate/user/:userId/token/:token" component={ AccountActivation } />
          <Route exact path="/signup/:status" component={ RegisterPageContainer } />
          <Route exact path="/forgot" component={ LoginPageContainer } />
        </Switch>
      </HashRouter>
    </SignupSigninPage>
  );
};

export default SessionPage;

