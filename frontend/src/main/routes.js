import React from 'react'
import { Route, HashRouter, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from '../components/areas/private/components/session/private-route'
import PublicPageContainer from '../containers/public-container'
import ProfileContainer from '../containers/profile'
import SessionPage from '../components/areas/public/features/session/pages/session-page'
import FourOFour from '../components/design-library/pages/public-pages/four-o-four-public-page/four-o-four-public-page'
import Stats from '../components/areas/public/features/stats/Stats-main-page'
import Auth from '../modules/auth'

export default props => (
  <HashRouter>
    <Switch>
      <PrivateRoute path="/profile" component={ ProfileContainer } />
      <Route exact path="/stats" component={ Stats } />

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
      <Route path={
          [
            '/reset-password',
            '/signup',
            '/signin',
            '/forgot',
            '/activate/user/:userId/token/:token',
            '/token/:token'
          ]
        }
        component={ SessionPage } 
      />
      <Route path="/" component={ PublicPageContainer } />

      <Route path="/404" component={ FourOFour } />
      <Route component={ FourOFour } />
    </Switch>
  </HashRouter>
)
