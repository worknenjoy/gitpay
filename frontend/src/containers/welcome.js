import { connect } from 'react-redux'
import Welcome from '../components/areas/public/features/welcome/pages/welcome-page'
import { addDialog, closeDialog } from '../actions/notificationActions'
import { loggedIn, logOut } from '../actions/loginActions'
import { info } from '../actions/infoActions'

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: state.loggedIn,
    info: state.info.data,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    isLogged: () => dispatch(loggedIn()),
    signOut: () => dispatch(logOut()),
    openDialog: (target) => dispatch(addDialog(target)),
    closeDialog: () => dispatch(closeDialog()),
    getInfo: () => dispatch(info())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
