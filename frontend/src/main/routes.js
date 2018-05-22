import React from 'react'
import { Route, HashRouter, Switch, BrowserRouter } from 'react-router-dom'

import Welcome from '../components/welcome/welcome';
import Session from '../components/session/session';
import Profile from '../components/profile/profile';
import Task from '../components/task/task';

export default props => (
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Welcome} />
        <Route path="/profile" component={Profile} />
        <Route exact path='/token/:token' component={Session} />
        <Route exact path='/task/:id' component={Task} />
        <Route exact path='/task/:id/orders' component={Task} />
      </Switch>
    </HashRouter>
)
