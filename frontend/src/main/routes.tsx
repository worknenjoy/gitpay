import React from 'react'
import { Route, HashRouter, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from '../components/areas/private/components/session/private-route'
import PublicPageContainer from '../containers/public/public-container'
import ProfileContainer from '../containers/profile'
import VerifyEmailContainer from '../containers/auth/verify-email'
import AcceptTermsContainer from '../containers/auth/accept-terms'
import SessionPage from '../components/areas/public/features/session/pages/session-page'
import FourOFour from '../components/design-library/pages/public-pages/four-o-four-public-page/four-o-four-public-page'
import PaymentRequestPayPage from '../components/areas/public/features/payment-request/pages/payment-request-pay-page'
import Auth from '../modules/auth'

export default (props) => (
  <HashRouter>
    <Switch>
      <PrivateRoute path="/profile" component={ProfileContainer} />
      <PrivateRoute exact path="/verify-email" component={VerifyEmailContainer} />
      <PrivateRoute exact path="/accept-terms" component={AcceptTermsContainer} />

      {/* Root redirect */}
      <Route
        exact
        path="/"
        render={() =>
          Auth.isUserAuthenticated() ? <Redirect to="/profile" /> : <PublicPageContainer />
        }
      />
      <Route
        path={[
          '/reset-password',
          '/signup',
          '/signup/:type',
          '/signin',
          '/forgot',
          '/activate/user/:userId/token/:token',
          '/accept-terms/:token',
          '/token/:token'
        ]}
        component={SessionPage}
      />
      <Route exact path="/payment-requests/:id/pay" component={PaymentRequestPayPage} />

      <Route path="/" component={PublicPageContainer} />

      <Route path="/404" component={FourOFour} />
      <Route component={FourOFour} />
    </Switch>
  </HashRouter>
)
