import React, { Component } from 'react';
import { Route, HashRouter, Switch, BrowserRouter } from 'react-router-dom';
import Auth from '../../modules/auth';

import ProfileContainer from '../../containers/profile'

class AuthLocal extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!Auth.isUserAuthenticated()) {
      this.props.history.replace("/");
    } else {
      this.props.history.replace("/profile");
    }
  }

  render() {
    return (
      <HashRouter>
        <Switch>
          { Auth.isUserAuthenticated() ? (
            <Route exact path='/profile' component={ProfileContainer} />
          ) : (
            <Route exact path='/' />
          )
          }
        </Switch>
      </HashRouter>
    )
  }
}

export default AuthLocal;
