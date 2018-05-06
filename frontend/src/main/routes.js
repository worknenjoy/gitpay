import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
import Auth from '../modules/auth';

import Welcome from '../components/welcome/welcome';
import Session from '../components/session/session';
import Profile from '../components/profile/profile';
import Task from '../components/task/task';
import Order from '../components/order/order';

const isAuth = (nextState, replace) => {
  if(!Auth.isUserAuthenticated()) {
    replace('/');
  }
};

export default props => (
    <Router history={hashHistory}>
        <Route path='/' component={Welcome} />
        <Route path="/profile" component={Profile} onEnter={isAuth} />
        <Route path='/token/:token' component={Session} />
        <Route path='/task/:id' component={Task} />
      <Route path='/task/:id/orders' component={Task} />
    </Router>
)
