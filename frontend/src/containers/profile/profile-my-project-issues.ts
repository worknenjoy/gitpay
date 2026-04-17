/* eslint-disable no-console */
import { connect } from 'react-redux'
import UserMyProjectIssuesPage from '../../components/areas/private/features/issues/pages/my-project-issues-page'
import { listTasks } from '../../actions/taskActions'
import { fetchProject, listProjects } from '../../actions/projectActions'
import { listLabels } from '../../actions/labelActions'
import { listLanguage } from '../../actions/languageActions'
import { getProject } from '../../selectors/tasks'
import { getCurrentUser } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any, props: any) => {
  return {
    user: getCurrentUser(state),
    issues: state.tasks,
    project: getProject(state),
    labels: state.labels,
    languages: state.languages
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    listTasks: (params: any) => dispatch(listTasks(params)),
    fetchProject: (projectId: any, params: any) => dispatch(fetchProject(projectId, params)),
    listProjects: () => dispatch(listProjects()),
    listLabels: () => dispatch(listLabels()),
    listLanguages: () => dispatch(listLanguage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMyProjectIssuesPage)
