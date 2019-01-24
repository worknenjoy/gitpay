import React from 'react'
import PropTypes from 'prop-types'

import {
  Route,
  Redirect
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
            pathname: '/login',
            state: { from: props.location }
          } }
        />
      )
    }
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.object
}

export default PrivateRoute
