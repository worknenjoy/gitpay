import { connect } from 'react-redux'
import ExploreIssuesPage from '../components/areas/private/features/issues/pages/user-issues-explore-page'
import { listTasks, filterTasks } from '../actions/taskActions'
import { listLabels } from '../actions/labelActions'
import { listLanguage } from '../actions/languageActions'
import { getFilteredTasks } from '../selectors/tasks'
import { getCurrentUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getCurrentUser(state),
    issues: getFilteredTasks(state),
    labels: state.labels,
    languages: state.languages
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: (params) => dispatch(listTasks(params)),
    filterTasks: (tasks, key, value, additional) =>
      dispatch(filterTasks(tasks, key, value, additional)),
    listLabels: () => dispatch(listLabels()),
    listLanguages: () => dispatch(listLanguage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreIssuesPage)
