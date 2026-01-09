import React, { useEffect } from 'react'
import { Route, Switch, HashRouter } from 'react-router-dom'
import PrivateBase from 'design-library/templates/base/private-base/private-base'
import DashboardContainer from '../../../../containers/dashboard/dashboard'
import { UserAccount } from '../features/account/user-account'
import UserTasksExploreContainer from '../../../../containers/user-tasks-explore'
import UserTasksContainer from '../../../../containers/user-tasks'
import ClaimsContainer from '../../../../containers/claims'
import PaymentsContainer from '../../../../containers/payments'
import PaymentRequestContainer from '../../../../containers/payment-requests'
import WalletsContainer from '../../../../containers/wallets'
import PayoutsContainer from '../../../../containers/payouts'
import TaskContainer from '../../../../containers/task'
import TaskPrivateContainer from '../../../../containers/task-private'
import ProjectIssuesExploreContainer from '../../../../containers/profile-explore-project-issues'
import MyProjectIssuesContainer from '../../../../containers/profile-my-project-issues'
import OrganizationIssuesExploreContainer from '../../../../containers/profile-explore-organization-issues'
import MyOrganizationIssuesContainer from '../../../../containers/profile-my-organization-issues'
import InvoiceSettingsContainer from '../../../../containers/account/invoice-settings/invoice-settings'
import PayoutSettings from '../features/payout-settings/pages/payout-settings-page'

const PrivatePage = ({
  fetchOrganizations,
  user,
  createTask,
  updateUser,
  changePassword,
  resendActivationEmail,
  updateUserEmail,
  addNotification,
  deleteUser,
  signOut,
  info,
  getInfo
}) => {
  useEffect(() => {
    fetchOrganizations()
  }, [])

  return (
    <PrivateBase
      createTask={createTask}
      signOut={signOut}
      onResendActivationEmail={resendActivationEmail}
      user={user}
      bottomProps={{
        info: info.data,
        getInfo
      }}
    >
      <HashRouter>
        <Switch>
          <Route exact path="/profile" component={DashboardContainer} />
          <Route
            path="/profile/user-account"
            component={(props) => (
              <UserAccount
                user={user}
                updateUser={updateUser}
                changePassword={changePassword}
                addNotification={addNotification}
                deleteUser={deleteUser}
                updateUserEmail={updateUserEmail}
              />
            )}
          />
          <Route exact path="/profile/explore" component={UserTasksExploreContainer} />
          <Route exact path="/profile/explore/:filter" component={UserTasksExploreContainer} />
          <Route exact path="/profile/tasks" component={UserTasksContainer} />
          <Route exact path="/profile/tasks/:filter" component={UserTasksContainer} />
          <Route exact path="/profile/payments" component={PaymentsContainer} />

          <Route exact path="/profile/payment-requests" component={PaymentRequestContainer} />

          <Route exact path="/profile/wallets" component={WalletsContainer} />

          <Route exact path="/profile/claims" component={ClaimsContainer} />

          <Route exact path="/profile/payouts" component={PayoutsContainer} />

          <Route
            exact
            path={[
              '/profile/task/:id',
              '/profile/task/:id/:slug',
              '/profile/explore/task/:id',
              '/profile/explore/task/:id/:slug'
            ]}
            component={TaskPrivateContainer}
          />
          <Route
            exact
            path="/profile/task/:id/offers"
            component={(props) => <TaskContainer noTopBar noBottomBar {...props} />}
          />
          <Route
            exact
            path="/profile/task/:id/:slug/offers"
            component={(props) => <TaskContainer noTopBar noBottomBar {...props} />}
          />
          <Route
            exact
            path={[
              '/profile/explore/organizations/:organization_id',
              '/profile/explore/organizations/:organization_id/:slug'
            ]}
            component={OrganizationIssuesExploreContainer}
          />
          <Route
            exact
            path={[
              '/profile/organizations/:organization_id',
              '/profile/organizations/:organization_id/:filter',
              '/profile/organizations/:organization_id/:slug'
            ]}
            component={MyOrganizationIssuesContainer}
          />
          <Route
            exact
            path={[
              '/profile/explore/organizations/:organization_id/projects/:project_id',
              '/profile/explore/organizations/:organization_id/projects/:project_id/:filter',
              '/profile/explore/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug',
              '/profile/explore/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug/:filter'
            ]}
            component={ProjectIssuesExploreContainer}
          />
          <Route
            exact
            path={[
              '/profile/organizations/:organization_id/projects/:project_id',
              '/profile/organizations/:organization_id/projects/:project_id/:filter',
              '/profile/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug',
              '/profile/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug/:filter',
              '/profile/organizations/:organization_id/projects/:project_id/:filter'
            ]}
            component={MyProjectIssuesContainer}
          />
          <Route path={'/profile/payout-settings'} component={PayoutSettings} />
          <Route path={'/profile/invoice-settings'} component={InvoiceSettingsContainer} />
        </Switch>
      </HashRouter>
    </PrivateBase>
  )
}

export default PrivatePage
