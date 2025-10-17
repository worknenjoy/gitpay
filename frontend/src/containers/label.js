import { connect } from 'react-redux'
import { listLabels } from '../actions/labelActions'
import Label from '../components/design-library/atoms/filters/labels-filter/labels-filter'
import { listTasks } from '../actions/taskActions'

const mapStateToProps = (state, ownProps) => {
  return {
    labels: state.labels
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listLabels: (params) => dispatch(listLabels(params)),
    listTasks: (params) => dispatch(listTasks(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Label)
