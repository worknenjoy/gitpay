import { connect } from 'react-redux'
import TaskOrders from '../components/task/task-orders'
import { addNotification } from '../actions/notificationActions'
import { changeTaskTab } from '../actions/taskActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.loggedIn.user,
    task: state.task
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message) => dispatch(addNotification(message)),
    changeTab: (tab) => dispatch(changeTaskTab(tab))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskOrders)
