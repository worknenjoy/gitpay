/* eslint-disable no-console */
import { connect } from 'react-redux'
import { filterTasks } from '../actions/taskActions'
import TaskFilters from '../components/design-library/atoms/filters/issue-filter/issue-filter'

const mapStateToProps = (state) => ({
  tasks: state.tasks.data,
  filteredTasks: state.tasks.filteredData
})

const mapDispatchToProps = {
  filterTasks
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskFilters)
