import { connect } from 'react-redux'
import TaskTabs from '../components/task/task-tabs'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.loggedIn.user
  }
}

export default connect(mapStateToProps)(TaskTabs)
