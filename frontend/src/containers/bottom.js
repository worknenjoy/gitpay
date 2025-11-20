import { connect } from 'react-redux'
import Bottom from '../components/shared/bottom/bottom'
import { info } from '../actions/infoActions'

const mapStateToProps = (state, ownProps) => {
  return {
    tasks: state.info.data.tasks,
    bounties: state.info.data.bounties,
    users: state.info.data.users,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    info: () => dispatch(info()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bottom)
