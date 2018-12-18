import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'

import PrivateRoute from '../components/session/private-route'

import WelcomeContainer from '../containers/welcome'
import Session from '../components/session/session'
import ProfileContainer from '../containers/profile'
import TaskContainer from '../containers/task'
import TaskOrdersContainer from '../containers/task-orders'
import TaskExplorer from '../components/task/task-explorer'
import LoginPage from '../components/session/login-page'
import LoginPageContainer from '../containers/login-page'

export default props => (
  <HashRouter>
    <Switch>
      <Route exact path='/' component={ WelcomeContainer } />
      <PrivateRoute path='/profile' component={ ProfileContainer } />
      <Route path='/tasks/explore' component={ TaskExplorer } />
      <Route exact path='/login' component={ LoginPage } />
      <Route exact path='/login/:status' component={ LoginPageContainer } />
      <Route exact path='/token/:token' component={ Session } />
      <Route exact path='/task/:id' component={ TaskContainer } />
      <Route exact path='/task/:id/order/:order_id/status/:status' component={ TaskOrdersContainer } />
    </Switch>
  </HashRouter>
)
