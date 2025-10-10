import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import PublicBase from 'design-library/templates/base/public-base/public-base';
import HomePage from 'design-library/pages/public-pages/home-public-page/home-public-page'
import TaskContainer from '../../../../containers/task'
import TaskOrdersContainer from '../../../../containers/task-orders'
import WelcomeContainer from '../../../../containers/welcome';
import TaskExplorer from '../../../../containers/task-explorer'
import useCommonActions from '../../../../hooks/use-common-actions';
import ExplorePage from '../features/explore/pages/explore-page'
import PricingPage from '../features/pricing/pages/pricing-page';

const TaskExplorerProjects = (props) => <TaskExplorer {...props} />
const TaskExplorerOrganizations = (props) => <TaskExplorer {...props} />

const PublicPage = ({
  user,
  createTask,
  fetchRoles,
  forgotPassword,
  getInfo,
  info,
  isLogged,
  registerUser,
  roles,
  signOut,
}) => {

  const commonProps = useCommonActions({
    user,
    createTask,
    fetchRoles,
    forgotPassword,
    getInfo,
    info,
    isLogged,
    registerUser,
    roles,
    signOut
  });

  return (
    <PublicBase
      { ...commonProps }
    >
      <HashRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/welcome" component={WelcomeContainer} />
          <Route path="/pricing" component={ PricingPage } />
          <Route exact path="/task/:id" component={TaskContainer} />
          <Route exact path="/task/:id/:slug" component={TaskContainer} />
          <Route exact path="/task/:id/orders" component={TaskContainer} />
          <Route exact path="/task/:id/status" component={TaskContainer} />
          <Route exact path="/task/:id/status/:status" component={TaskContainer} />
          <Route exact path="/task/:id/orders/:order_id" component={TaskContainer} />
          <Route exact path="/task/:id/:slug/interested" component={TaskContainer} />
          <Route exact path="/task/:id/interested/:interested_id" component={TaskContainer} />
          <Route exact path="/task/:id/members" component={TaskContainer} />
          <Route
            exact
            path="/task/:id/order/:order_id/status/:status"
            component={TaskOrdersContainer}
          />
          <Route exact path="/projects" component={ (props) => <TaskExplorerOrganizations {...props} /> } />
          <Route exact path="/organizations" component={ (props) => <TaskExplorerOrganizations {...props} /> } />
          <Route exact path="/organizations/:organization_id" component={ (props) => <TaskExplorerOrganizations {...props} /> } />
          <Route exact path="/organizations/:organization_id/:slug" component={ (props) => <TaskExplorerOrganizations {...props} /> } />
          <Route exact path="/organizations/:organization_id/projects/:project_id" component={ (props) => <TaskExplorerProjects {...props} />} />
          <Route exact path="/organizations/:organization_id/projects/:project_id/:filter" component={ (props) => <TaskExplorerProjects {...props} /> } />
          <Route exact path="/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug" component={ (props) => <TaskExplorerProjects {...props} /> } />
          <Route exact path="/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug/:filter" component={ (props) => <TaskExplorerProjects {...props} /> } />

          <Route path="/explore" component={ ExplorePage } />
          <Route exact path="/tasks/:filter" component={ () => <Redirect to="/explore" /> } />
        </Switch>
      </HashRouter>
    </PublicBase>
  );
}

export default PublicPage;