import { connect } from 'react-redux'
import TaskTabs from '../components/task/task-tabs'
import { changeTaskTab } from '../actions/taskActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.loggedIn.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeTab: (tab) => dispatch(changeTaskTab(tab))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskTabs)
