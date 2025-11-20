import React from 'react'
import PropTypes from 'prop-types'

import { Route, Redirect } from 'react-router-dom'
import Auth from '../../../../../modules/auth'

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        Auth.isUserAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.object
}

export default PrivateRoute
