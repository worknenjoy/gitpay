import React, { useEffect } from 'react';
import { Route, Switch, HashRouter, useHistory } from 'react-router-dom'
import PrivateBase from 'design-library/templates/base/private-base/private-base';
import ProfileOptions from '../features/dashboard/profile-options'
import { UserAccount } from '../features/account/user-account'
import UserTasksExploreContainer from '../../../../containers/user-tasks-explore'
import UserTasksContainer from '../../../../containers/user-tasks'
import TransfersContainer from '../../../../containers/transfers'
import PaymentsContainer from '../../../../containers/payments'
import PaymentRequestContainer from '../../../../containers/payment-requests'
import WalletsContainer from '../../../../containers/wallets'
import PayoutsContainer from '../../../../containers/payouts'
import TaskListProfile from '../../../../containers/task-list-profile'
import TaskContainer from '../../../../containers/task'
import PayoutSettings from '../features/payout-settings/pages/payout-settings-page'

const TaskListProfileProjects = (props) => <TaskListProfile {...props} />
const TaskListProfileOrganization = (props) => <TaskListProfile noTopBar noBottomBar {...props} />

const PrivatePage = ({
  fetchOrganizations,
  user,
  createTask,
  updateUser,
  changePassword,
  resendActivationEmail,
  addNotification,
  deleteUser,
  signOut,
  info,
  getInfo
}) => {
  const history = useHistory()

  const { data } = user;

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <PrivateBase
      createTask={createTask}
      signOut={signOut}
      onResendActivationEmail={resendActivationEmail}
      user={user}
      bottomProps={
        {
          info: info.data,
          getInfo
        }
      }
    >
      <HashRouter>
        <Switch>
          <Route exact path="/profile" component={
            (props) =>
            (<ProfileOptions
              {...props}
              user={user}
            />)
          } />
          <Route path="/profile/user-account" component={
            (props) =>
            (<UserAccount
              user={data}
              updateUser={updateUser}
              changePassword={changePassword}
              addNotification={addNotification}
              history={history}
              deleteUser={deleteUser}
            />)
          }
          />
          <Route
            exact
            path="/profile/explore"
            component={UserTasksExploreContainer}
          />
          <Route
            exact
            path="/profile/explore/:filter"
            component={UserTasksExploreContainer}
          />
          <Route
            exact
            path="/profile/tasks"
            component={UserTasksContainer}
          />
          <Route
            exact
            path="/profile/tasks/:filter"
            component={UserTasksContainer}
          />
          <Route
            exact
            path="/profile/payments"
            component={PaymentsContainer}
          />

          <Route
            exact
            path="/profile/payment-requests"
            component={PaymentRequestContainer}
          />

          <Route
            exact
            path="/profile/wallets"
            component={WalletsContainer}
          />

          <Route
            exact
            path="/profile/transfers"
            component={TransfersContainer}
          />

          <Route
            exact
            path="/profile/transfers/:transfer_id"
            component={TransfersContainer}
          />

          <Route
            exact
            path="/profile/payouts"
            component={PayoutsContainer}
          />

          <Route
            exact
            path={[
              '/profile/task/:id',
              '/profile/task/:id/:slug',
              '/profile/explore/task/:id',
              '/profile/explore/task/:id/:slug'
            ]}
            component={(props) => <TaskContainer noTopBar noBottomBar {...props} />}
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
              '/profile/organizations/:organization_id',
              '/profile/organizations/:organization_id/:slug',
              '/profile/explore/organizations/:organization_id',
              '/profile/explore/organizations/:organization_id/:slug'
            ]}
            component={TaskListProfileOrganization}
          />
          <Route
            exact
            path={[
              '/profile/organizations/:organization_id/projects/:project_id',
              '/profile/organizations/:organization_id/projects/:project_id/:filter',
              '/profile/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug',
              '/profile/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug/:filter',
              '/profile/organizations/:organization_id/projects/:project_id/:filter',
              '/profile/explore/organizations/:organization_id/projects/:project_id',
              '/profile/explore/organizations/:organization_id/projects/:project_id/:filter',
              '/profile/explore/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug',
              '/profile/explore/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug/:filter'
            ]}
          >
            <TaskListProfileProjects noTopBar noBottomBar />
          </Route>
          <Route
            
            path={'/profile/payout-settings'} component={PayoutSettings}
          />
        </Switch>
      </HashRouter>
    </PrivateBase>
  );
};

export default PrivatePage;
