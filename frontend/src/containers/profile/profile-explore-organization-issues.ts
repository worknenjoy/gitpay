/* eslint-disable no-console */
import { connect } from 'react-redux'
import UserOrganizationIssuesExplorePage from '../../components/areas/private/features/issues/pages/user-organization-issues-explore-page'
import { listTasks, filterTasks } from '../../actions/taskActions'
import { fetchOrganization } from '../../actions/organizationsActions'
import { listLabels } from '../../actions/labelActions'
import { listLanguage } from '../../actions/languageActions'
import { getFilteredTasks, getOrganization } from '../../selectors/tasks'
import { getCurrentUser } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any, props: any) => {
  return {
    user: getCurrentUser(state),
    issues: getFilteredTasks(state),
    organization: getOrganization(state),
    labels: state.labels,
    languages: state.languages
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    listTasks: (params: any) => dispatch(listTasks(params)),
    filterTasks: (key: any, value: any, additional: any) =>
      dispatch(filterTasks(key, value, additional)),
    fetchOrganization: (organizationId: any) =>
      dispatch(fetchOrganization(organizationId)),
    listLabels: () => dispatch(listLabels()),
    listLanguages: () => dispatch(listLanguage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOrganizationIssuesExplorePage)
