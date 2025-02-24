import { connect } from 'react-redux'
import TaskOrders from '../components/areas/public/features/task/task-orders'
import { addNotification } from '../actions/notificationActions'
import { changeTaskTab } from '../actions/taskActions'
import { getUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getUser(state),
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
