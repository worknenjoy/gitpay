import React from 'react'
import { Route, HashRouter, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from '../components/areas/private/components/session/private-route'
import PublicPageContainer from '../containers/public-container'
import Session from '../components/areas/private/components/session/session'
import ProfileContainer from '../containers/profile'
import AccountActivation from '../containers/account-activation'
import LoginPageContainer from '../containers/login-page'
import FourOFour from '../components/design-library/pages/public-pages/four-o-four-public-page/four-o-four-public-page'
import Stats from '../components/areas/public/features/stats/Stats-main-page'
import TaskListUser from '../containers/task-list-user'
import Auth from '../modules/auth'

export default props => (
  <HashRouter>
    <Switch>
      {/* <Route exact path="/recruitment" component={ LandingPage } /> */}

      {/* Make sure token auth happens before the broad "/" route */}
      <Route exact path="/token/:token" component={ Session } />

      {/* Private area needs to appear before the broad "/" route */}
      <PrivateRoute path="/profile" component={ ProfileContainer } />

      <Route exact path="/signin" component={ LoginPageContainer } />
      <Route exact path="/signin/:status" component={ LoginPageContainer } />
      <Route exact path="/signup" component={ LoginPageContainer } />
      <Route exact path="/reset-password/:token" component={ LoginPageContainer } />
      <Route exact path="/activate/user/:userId/token/:token" component={ AccountActivation } />
      <Route exact path="/signup/:status" component={ LoginPageContainer } />
      <Route exact path="/stats" component={ Stats } />
      <Route exact path="/users/:usernameId" component={ TaskListUser } />

      {/* Root redirect */}
      <Route
        exact
        path="/"
        render={() =>
          Auth.isUserAuthenticated()
            ? <Redirect to="/profile" />
            : <PublicPageContainer />
        }
      />

      {/* Keep this AFTER specific routes so they can match */}
      <Route path="/" component={ PublicPageContainer } />

      <Route path="/404" component={ FourOFour } />
      <Route component={ FourOFour } />
    </Switch>
  </HashRouter>
)
