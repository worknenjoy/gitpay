/* eslint-disable no-console */
import { connect } from 'react-redux'
import ExploreIssuePage from '../components/areas/public/features/explore/pages/explore-issues-page'
import { listTasks, filterTasks } from '../actions/taskActions'
import { listLabels } from '../actions/labelActions'
import { listLanguage } from '../actions/languageActions'
import { getFilteredTasks } from '../selectors/tasks'

const mapStateToProps = (state) => ({
  issues: state.tasks,
  filteredTasks: getFilteredTasks(state),
  labels: state.labels,
  languages: state.languages
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({ status }) => dispatch(listTasks({ status })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional)),
    listLabels: () => dispatch(listLabels()),
    listLanguages: () => dispatch(listLanguage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreIssuePage)
