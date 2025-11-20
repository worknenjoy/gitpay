import { connect } from 'react-redux'
import { getTaskOrdersByFilter } from '../selectors/task'
import TaskSolve from '../components/areas/public/features/issue/task-solve'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn,
    task: getTaskOrdersByFilter(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskSolve)
