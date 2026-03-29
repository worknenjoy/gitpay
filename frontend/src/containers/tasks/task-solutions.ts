import { connect } from 'react-redux'
import TaskSolutions from '../../components/areas/private/features/task-solutions/task-solutions'
import { listTaskSolutions } from '../../actions/taskSolutionActions'
import { getUserData } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getUserData(state),
    taskSolutions: state.taskSolutions
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    listTaskSolutions: () => dispatch(listTaskSolutions())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskSolutions)
