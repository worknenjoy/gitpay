/* eslint-disable no-console */
import { connect } from 'react-redux'
import UserMyProjectIssuesPage from '../components/areas/private/features/issues/pages/my-project-issues-page'
import { listTasks, filterTasks } from '../actions/taskActions'
import { fetchProject, listProjects } from '../actions/projectActions'
import { listLabels } from '../actions/labelActions'
import { listLanguage } from '../actions/languageActions'
import { getFilteredTasks, getProject } from '../selectors/tasks'
import { getCurrentUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state, props) => {
  return {
    user: getCurrentUser(state),
    issues: getFilteredTasks(state),
    project: getProject(state),
    labels: state.labels,
    languages: state.languages
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: (params) => dispatch(listTasks(params)),
    filterTasks: (tasks, key, value, additional) =>
      dispatch(filterTasks(tasks, key, value, additional)),
    fetchProject: (projectId, params) => dispatch(fetchProject(projectId, params)),
    listProjects: () => dispatch(listProjects()),
    listLabels: () => dispatch(listLabels()),
    listLanguages: () => dispatch(listLanguage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMyProjectIssuesPage)
