/* eslint-disable no-console */
import { connect } from 'react-redux'
import TaskList from '../components/task/task-list'
import { listTasks, filterTasks } from '../actions/taskActions'
import { fetchProject, listProjects } from '../actions/projectActions'
import { getFilteredTasks, getUser, getProject } from '../selectors/tasks'

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
    listTasks: (projectId) => dispatch(listTasks(projectId)),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional)),
    fetchProject: (projectId) => dispatch(fetchProject(projectId)),
    listProjects: () => dispatch(listProjects())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
