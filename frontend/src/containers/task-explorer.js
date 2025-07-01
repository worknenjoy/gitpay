/* eslint-disable no-console */
import { connect } from 'react-redux'
import TaskExplorer from '../components/areas/public/features/task/task-explorer'
import { listTasks, filterTasks } from '../actions/taskActions'
import { getFilteredTasks } from '../selectors/tasks'

const mapStateToProps = (state) => ({
  tasks: state.tasks.data,
  filteredTasks: getFilteredTasks(state)
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({ status }) => dispatch(listTasks({ status })),
    filterTasks: (tasks, key, value, additional) => dispatch(filterTasks(tasks, key, value, additional))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskExplorer)
