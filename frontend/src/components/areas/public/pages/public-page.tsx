import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import PublicBase from 'design-library/templates/base/public-base/public-base'
import HomePage from 'design-library/pages/public-pages/home-public-page/home-public-page'
import TaskContainer from '../../../../containers/tasks/task'
import WelcomeContainer from '../../../../containers/public/welcome'
import ProjectPageContainer from '../../../../containers/pages/project-page'
import OrganizationPageContainer from '../../../../containers/pages/organization-page'
import TaskListUser from '../../../../containers/tasks/task-list-user'
import useCommonActions from '../../../../hooks/use-common-actions'
import ExplorePage from '../features/explore/pages/explore-page'
import PricingPage from '../features/pricing/pages/pricing-page'
import TeamPage from '../features/team/pages/team'
import OpenSourcePage from '../features/welcome/pages/open-source-page'
import PrivateProjectsPage from '../features/welcome/pages/private-projects-page'
import ServicePaymentsPage from '../features/welcome/pages/service-payments-page'

const PublicPage = ({
  user,
  createTask,
  fetchRoles,
  forgotPassword,
  getInfo,
  info,
  isLogged,
  joinTeam,
  registerUser,
  roles,
  signOut
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
  })

  return (
    <PublicBase {...commonProps}>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/welcome" component={WelcomeContainer} />
          <Route exact path="/use-cases/open-source" component={OpenSourcePage} />
          <Route exact path="/use-cases/private-projects" component={PrivateProjectsPage} />
          <Route exact path="/use-cases/service-payments" component={ServicePaymentsPage} />
          <Route exact path="/team" render={() => <TeamPage joinTeamAPICall={joinTeam} />} />
          <Route path="/pricing" component={PricingPage} />
          <Route exact path="/task/:id" component={TaskContainer} />
          <Route exact path="/task/:id/:slug" component={TaskContainer} />
          <Route exact path="/task/:id/orders" component={TaskContainer} />
          <Route exact path="/task/:id/status" component={TaskContainer} />
          <Route exact path="/task/:id/status/:status" component={TaskContainer} />
          <Route exact path="/task/:id/orders/:order_id" component={TaskContainer} />
          <Route exact path="/task/:id/order/:order_id/status/:status" component={TaskContainer} />
          <Route exact path="/task/:id/:slug/interested" component={TaskContainer} />
          <Route exact path="/task/:id/interested/:interested_id" component={TaskContainer} />
          <Route exact path="/task/:id/members" component={TaskContainer} />
          <Route
            exact
            path="/organizations/:organization_id"
            component={OrganizationPageContainer}
          />
          <Route
            exact
            path="/organizations/:organization_id/:slug"
            component={OrganizationPageContainer}
          />

          <Route
            exact
            path="/organizations/:organization_id/projects/:project_id"
            component={ProjectPageContainer}
          />
          <Route
            exact
            path="/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug"
            component={ProjectPageContainer}
          />

          <Route path="/explore" component={ExplorePage} />
          <Route exact path="/tasks/:filter" component={() => <Redirect to="/explore" />} />
          <Route exact path="/users/:userId" component={TaskListUser} />
        </Switch>
      </HashRouter>
    </PublicBase>
  )
}

export default PublicPage
