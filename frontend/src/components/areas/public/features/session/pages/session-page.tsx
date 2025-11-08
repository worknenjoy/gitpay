import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import SignupSigninPage from 'design-library/templates/base/signup-signin-base/signup-signin-base';
import AccountActivation from '../../../../../../containers/account-activation'
import LoginPageContainer from '../../../../../../containers/login-page'

const SessionPage = () => {
  return (
    <SignupSigninPage>
      <HashRouter>
        <Switch>
          <Route exact path="/signin" component={ LoginPageContainer } />
          <Route exact path="/signin/:status" component={ LoginPageContainer } />
          <Route exact path="/signup" component={ LoginPageContainer } />
          <Route exact path="/reset-password/:token" component={ LoginPageContainer } />
          <Route exact path="/activate/user/:userId/token/:token" component={ AccountActivation } />
          <Route exact path="/signup/:status" component={ LoginPageContainer } />
        </Switch>
      </HashRouter>
    </SignupSigninPage>
  );
};

export default SessionPage;

