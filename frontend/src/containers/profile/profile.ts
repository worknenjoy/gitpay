import { connect } from 'react-redux'
import PrivatePage from '../../components/areas/private/pages/private-page'
import { fetchPreferences } from '../../actions/preferencesActions'
import { logOut, changePassword } from '../../actions/loginActions'
import { listTasks, filterTasks, createTask } from '../../actions/taskActions'
import {
  updateUser,
  deleteUser,
  resendActivationEmail,
  updateUserEmail
} from '../../actions/userActions'
import {
  fetchOrganizations,
  createOrganizations,
  updateOrganization
} from '../../actions/organizationsActions'
import { addNotification, closeNotification } from '../../actions/notificationActions'
import { getFilteredTasks } from '../../selectors/tasks'
import { info } from '../../actions/infoActions'

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn,
    preferences: state.preferences,
    tasks: getFilteredTasks(state),
    organizations: state.organizations.organizations,
    completed: state.loggedIn.completed,
    info: state.info
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    fetchPreferences: () => dispatch(fetchPreferences()),
    fetchOrganizations: () => dispatch(fetchOrganizations()),
    createOrganizations: (org: any) => dispatch(createOrganizations(org)),
    updateOrganization: (org: any) => dispatch(updateOrganization(org)),
    updateUser: (userData: any) => dispatch(updateUser(userData)),
    changePassword: (data: any) => dispatch(changePassword(data)),
    resendActivationEmail: () => dispatch(resendActivationEmail()),
    deleteUser: (user: any) => dispatch(deleteUser(user)),
    updateUserEmail: (updateData: any) => dispatch(updateUserEmail(updateData)),
    addNotification: (message: any, options: any) => dispatch(addNotification(message, options)),
    closeNotification: () => dispatch(closeNotification()),
    createTask: (task: any, history: any) => dispatch(createTask(task, history)),
    listTasks: (params: any) => dispatch(listTasks(params)),
    filterTasks: (key: any, value: any, additional: any) =>
      dispatch(filterTasks(key, value, additional)),
    signOut: () => dispatch(logOut()),
    getInfo: () => dispatch(info())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivatePage)
