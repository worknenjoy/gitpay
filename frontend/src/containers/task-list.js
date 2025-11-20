/* eslint-disable no-console */
import { connect } from 'react-redux'
import TaskList from '../components/areas/public/features/issue/legacy/task-list'
import { listTasks, filterTasks } from '../actions/taskActions'
import { fetchProject, listProjects } from '../actions/projectActions'
import { fetchOrganization } from '../actions/organizationsActions'
import { getFilteredTasks, getProject, getOrganization } from '../selectors/tasks'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state, props) => {
  return {
    user: getUserData(state),
    tasks: getFilteredTasks(state),
    project: getProject(state),
    projects: state.projects,
    organization: getOrganization(state),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({ organizationId, projectId, userId, status }) =>
      dispatch(listTasks({ organizationId, projectId, userId, status })),
    filterTasks: (tasks, key, value, additional) =>
      dispatch(filterTasks(tasks, key, value, additional)),
    fetchProject: (projectId, params) => dispatch(fetchProject(projectId, params)),
    listProjects: () => dispatch(listProjects()),
    fetchOrganization: (id) => dispatch(fetchOrganization(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
