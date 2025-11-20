/* eslint-disable no-console */
import { connect } from 'react-redux'
import UserOrganizationIssuesExplorePage from '../components/areas/private/features/issues/pages/user-organization-issues-explore-page'
import { listTasks, filterTasks } from '../actions/taskActions'
import { fetchOrganization } from '../actions/organizationsActions'
import { listLabels } from '../actions/labelActions'
import { listLanguage } from '../actions/languageActions'
import { getFilteredTasks, getOrganization } from '../selectors/tasks'
import { getCurrentUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state, props) => {
  return {
    user: getCurrentUser(state),
    issues: getFilteredTasks(state),
    organization: getOrganization(state),
    labels: state.labels,
    languages: state.languages,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: (params) => dispatch(listTasks(params)),
    filterTasks: (tasks, key, value, additional) =>
      dispatch(filterTasks(tasks, key, value, additional)),
    fetchOrganization: (organizationId, params) =>
      dispatch(fetchOrganization(organizationId, params)),
    listLabels: () => dispatch(listLabels()),
    listLanguages: () => dispatch(listLanguage()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOrganizationIssuesExplorePage)
