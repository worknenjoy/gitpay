/* eslint-disable no-console */
import { connect } from 'react-redux'
import { filterTasks } from '../actions/taskActions'
import IssueFilter from '../components/design-library/atoms/filters/issue-filter/issue-filter'

const mapStateToProps = (state) => ({
  issues: state.issues.data,
  filteredIssues: state.issues.filteredData
})

const mapDispatchToProps = {
  filterTasks
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueFilter)
