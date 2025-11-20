/* eslint-disable no-console */
import { connect } from 'react-redux'
import ExplorePage from '../components/areas/public/features/explore/pages/explore-page'
import { listTasks, filterTasks } from '../actions/taskActions'
import { getFilteredTasks } from '../selectors/tasks'

const mapStateToProps = (state) => ({
  tasks: state.tasks.data,
  filteredTasks: getFilteredTasks(state),
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listTasks: ({ status }) => dispatch(listTasks({ status })),
    filterTasks: (tasks, key, value, additional) =>
      dispatch(filterTasks(tasks, key, value, additional)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplorePage)
