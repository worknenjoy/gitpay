import { connect } from 'react-redux'
import TaskOrders from '../components/areas/public/features/issue/legacy/task-orders'
import { addNotification } from '../actions/notificationActions'
import { changeTaskTab } from '../actions/taskActions'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getUserData(state),
    task: state.task,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message) => dispatch(addNotification(message)),
    changeTab: (tab) => dispatch(changeTaskTab(tab)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskOrders)
