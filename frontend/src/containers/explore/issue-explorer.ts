/* eslint-disable no-console */
import { connect } from 'react-redux'
import ExploreIssuePage from '../../components/areas/public/features/explore/pages/explore-issues-page'
import { listTasks, filterTasks } from '../../actions/taskActions'
import { listLabels } from '../../actions/labelActions'
import { listLanguage } from '../../actions/languageActions'
import { getFilteredTasks } from '../../selectors/tasks'

const mapStateToProps = (state: any) => ({
  issues: getFilteredTasks(state),
  labels: state.labels,
  languages: state.languages
})

const mapDispatchToProps = (dispatch: any, ownProps?: any) => {
  return {
    listTasks: (params: any) => dispatch(listTasks(params)),
    filterTasks: (key: any, value: any, additional: any) =>
      dispatch(filterTasks(key, value, additional)),
    listLabels: () => dispatch(listLabels()),
    listLanguages: () => dispatch(listLanguage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreIssuePage)
