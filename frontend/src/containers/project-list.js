/* eslint-disable no-console */
import { connect } from 'react-redux'
import ProjectList from '../components/project/project-list'
import { listTasks, filterTasks } from '../actions/taskActions'
import { fetchProject, listProjects } from '../actions/projectActions'
import { getFilteredTasks, getProject } from '../selectors/tasks'
import { getUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    tasks: getFilteredTasks(state),
    project: getProject(state),
    projects: state.projects
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({ organizationId, projectId, userId, status }) => dispatch(listTasks({ organizationId, projectId, userId, status })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional)),
    fetchProject: (projectId, params) => dispatch(fetchProject(projectId, params)),
    listProjects: () => dispatch(listProjects())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList)
