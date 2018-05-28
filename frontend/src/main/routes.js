import React from 'react'
import { Route, HashRouter, Switch, BrowserRouter } from 'react-router-dom'

import PrivateRoute from '../components/session/private-route';

import Welcome from '../components/welcome/welcome';
import Session from '../components/session/session';
import ProfileContainer from '../containers/profile';
import TaskContainer from '../containers/task';

export default props => (
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Welcome} />
        <PrivateRoute path="/profile" component={ProfileContainer} />
        <Route exact path='/token/:token' component={Session} />
        <Route exact path='/task/:id' component={TaskContainer} />
      </Switch>
    </HashRouter>
)
