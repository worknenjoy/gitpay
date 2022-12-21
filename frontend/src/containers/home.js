import { connect } from 'react-redux'
import Home from '../components/welcome/home'
import { addDialog, closeDialog } from '../actions/notificationActions'

const mapStateToProps = (state, ownProps) => {
  return {
    dialog: state.dialog,
    logged: state.loggedIn.logged
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openDialog: (target) => dispatch(addDialog(target)),
    closeDialog: () => dispatch(closeDialog())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
