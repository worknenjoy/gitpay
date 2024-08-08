/* eslint-disable no-console */
import { connect } from 'react-redux'
import { filterTasks } from '../actions/taskActions'
import TaskFilters from '../components/task/task-filters'

const mapStateToProps = (state) => ({
  tasks: state.tasks.data,
  filteredTasks: state.tasks.filteredData,
})

const mapDispatchToProps = {
  filterTasks,
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskFilters)
