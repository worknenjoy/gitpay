/* eslint-disable no-console */
import { connect } from 'react-redux'
import MyOrganizationIssuesPage from '../../components/areas/private/features/issues/pages/my-organization-issues-page'
import { listTasks } from '../../actions/taskActions'
import { fetchOrganization } from '../../actions/organizationsActions'
import { listLabels } from '../../actions/labelActions'
import { listLanguage } from '../../actions/languageActions'
import { getOrganization } from '../../selectors/tasks'
import { getCurrentUser } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any, props: any) => {
  return {
    user: getCurrentUser(state),
    issues: state.tasks,
    organization: getOrganization(state),
    labels: state.labels,
    languages: state.languages
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    listTasks: (params: any) => dispatch(listTasks(params)),
    fetchOrganization: (organizationId: any) => dispatch(fetchOrganization(organizationId)),
    listLabels: () => dispatch(listLabels()),
    listLanguages: () => dispatch(listLanguage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyOrganizationIssuesPage)
