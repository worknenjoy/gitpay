import React from 'react'
import { Route, HashRouter, Switch, Redirect } from 'react-router-dom'

import PrivateRoute from '../components/areas/profile/components/session/private-route'

import WelcomeContainer from '../containers/welcome'
import HomeContainer from '../containers/home'
import Session from '../components/areas/profile/components/session/session'
import ProfileContainer from '../containers/profile'
import AccountActivation from '../containers/account-activation'
import TaskContainer from '../containers/task'
import TaskOrdersContainer from '../containers/task-orders'
import TaskExplorer from '../containers/task-explorer'
import TeamContainer from '../containers/team.js'
import LoginPage from '../components/areas/profile/components/session/login-page'
import LoginPageContainer from '../containers/login-page'
import RecoverPasswordContainer from '../containers/recover-password'
import FourOFour from '../components/FourOFour.js'
import LandingPage from '../components/areas/public/features/welcome/landing-page'
import Stats from '../components/areas/public/features/stats/Stats-main-page'
import TaskListUser from '../containers/task-list-user'
import Pricing from '../components/areas/public/features/welcome/pricing'
import Auth from '../modules/auth'

const TaskExplorerProjects = (props) => <TaskExplorer {...props} />
const TaskExplorerOrganizations = (props) => <TaskExplorer {...props} />

export default props => (
  <HashRouter>
    <Switch>
      <Route path='/recruitment' component={ LandingPage } />
      <Route exact path='/' component={ Auth.isUserAuthenticated() ? () => <Redirect to='/profile' /> : HomeContainer } />
      <Route exact path='/welcome' component={ WelcomeContainer } />
      <PrivateRoute path='/profile' component={ ProfileContainer } />
      <Route path='/pricing' component={ Pricing } />
      <Route exact path='/projects' component={ (props) => <TaskExplorerOrganizations {...props} /> } />
      <Route exact path='/organizations' component={ (props) => <TaskExplorerOrganizations {...props} /> } />
      <Route exact path='/organizations/:organization_id' component={ (props) => <TaskExplorerOrganizations {...props} /> } />
      <Route exact path='/organizations/:organization_id/:slug' component={ (props) => <TaskExplorerOrganizations {...props} /> } />
      <Route exact path='/organizations/:organization_id/projects/:project_id' component={ (props) => <TaskExplorerProjects {...props} />} />
      <Route exact path='/organizations/:organization_id/projects/:project_id/:filter' component={ (props) => <TaskExplorerProjects {...props} /> } />
      <Route exact path='/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug' component={ (props) => <TaskExplorerProjects {...props} /> } />
      <Route exact path='/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug/:filter' component={ (props) => <TaskExplorerProjects {...props} /> } />
      <Route exact path='/tasks/:filter' component={ (props) => <TaskExplorer {...props} /> } />
      <Route exact path='/team' component={ TeamContainer } />
      <Route exact path='/signin' component={ LoginPage } />
      <Route exact path='/signin/:status' component={ LoginPageContainer } />
      <Route exact path='/signup' component={ LoginPage } />
      <Route exact path='/reset-password/:token' component={ RecoverPasswordContainer } />
      <Route exact path='/activate/user/:userId/token/:token' component={ AccountActivation } />
      <Route exact path='/signup/:status' component={ LoginPageContainer } />
      <Route exact path='/token/:token' component={ Session } />
      <Route exact path='/task/:id' component={ TaskContainer } />
      <Route exact path='/task/:id/:slug' component={ TaskContainer } />
      <Route exact path='/task/:id/orders' component={ TaskContainer } />
      <Route exact path='/task/:id/status' component={ TaskContainer } />
      <Route exact path='/task/:id/status/:status' component={ TaskContainer } />
      <Route exact path='/task/:id/orders/:order_id' component={ TaskContainer } />
      <Route exact path='/task/:id/:slug/interested' component={ TaskContainer } />
      <Route exact path='/task/:id/interested/:interested_id' component={ TaskContainer } />
      <Route exact path='/task/:id/members' component={ TaskContainer } />
      
      <Route exact path='/task/:id/history' component={ TaskContainer } />
      <Route exact path='/task/:id/claim' component={ TaskContainer } />
      <Route exact path='/stats' component={ Stats } />
      <Route
        exact
        path='/task/:id/order/:order_id/status/:status'
        component={ TaskOrdersContainer }
      />
      <Route exact path='/users/:usernameId' component={ TaskListUser } />
      <Route path='/404' component={ FourOFour } />
      <Route component={ FourOFour } />
    </Switch>
  </HashRouter>
)
