/* eslint-disable no-console */
import { connect } from 'react-redux'
import OrganizationPage from '../components/areas/public/features/organization/pages/organization-page'
import { fetchOrganization } from '../actions/organizationsActions'
import { listTasks, filterTasks } from '../actions/taskActions'
import { listLabels } from '../actions/labelActions'
import { listLanguage } from '../actions/languageActions'
import { getFilteredTasks } from '../selectors/tasks'

const mapStateToProps = (state) => ({
  organization: state.organization,
  issues: getFilteredTasks(state),
  labels: state.labels,
  languages: state.languages
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: (params) => dispatch(listTasks(params)),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional)),
    listLabels: () => dispatch(listLabels()),
    listLanguages: () => dispatch(listLanguage()),
    fetchOrganization: (id) => dispatch(fetchOrganization(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationPage)
