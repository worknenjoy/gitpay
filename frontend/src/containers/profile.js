import { connect } from 'react-redux'
import Profile from '../components/profile/profile'
import { addNotification, loggedIn } from '../actions/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn.user,
    completed: state.loggedIn.completed
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    notAuthorizedNotification: () => {
      dispatch(addNotification("Você não está autorizado a entrar nesta página, acesse sua conta"))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
