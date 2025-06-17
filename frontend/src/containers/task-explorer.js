/* eslint-disable no-console */
import { connect } from 'react-redux'
import TaskExplorer from '../components/areas/public/features/task/task-explorer'
import { listTasks } from '../actions/taskActions'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({ status }) => dispatch(listTasks({ status }))
  }
}

export default connect(undefined, mapDispatchToProps)(TaskExplorer)
