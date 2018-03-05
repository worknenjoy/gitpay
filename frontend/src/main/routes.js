import React from 'react'
import { Router, Route, Redirect, hashHistory } from 'react-router'

import Welcome from '../components/welcome/welcome';
import Session from '../components/session/session';
import Profile from '../components/profile/profile';

export default props => (
    <Router history={hashHistory}>
        <Route path='/' component={Welcome} />
        <Route path="/profile" component={Profile} />
        <Route path='/token/:token' component={Session} />
    </Router>
)
