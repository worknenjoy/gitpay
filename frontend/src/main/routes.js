import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
import Auth from '../modules/auth';

import Welcome from '../components/welcome/welcome';
import Session from '../components/session/session';
import Profile from '../components/profile/profile';

const isAuth = (nextState, replace) => {
  //console.log(nextState);
  //console.log(replace);
  if(!Auth.isUserAuthenticated()) {
    replace('/');
  }
};

export default props => (
    <Router history={hashHistory}>
        <Route path='/' component={Welcome} />
        <Route path="/profile" component={Profile} onEnter={isAuth} />
        <Route path='/token/:token' component={Session} />
    </Router>
)
