import { connect } from 'react-redux'
import Info from '../components/welcome/components/Info'
import { info } from '../actions/infoActions'

const mapStateToProps = (state, ownProps) => {
  return {
    tasks: state.info.data.tasks,
    bounties: state.info.data.bounties,
    users: state.info.data.users
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    info: () => dispatch(info())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info)
