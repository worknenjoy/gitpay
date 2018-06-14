import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import Auth from '../../modules/auth'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    { ...rest }
    render={ props =>
      Auth.isUserAuthenticated() ? (
        <Component { ...props } />
      ) : (
        <Redirect
          to={ {
            pathname: '/',
            state: { from: props.location }
          } }
        />
      )
    }
  />
)

export default PrivateRoute
