import { connect } from 'react-redux'
import { registerUser } from '../actions/loginActions'
import LoginForm from '../components/session/login-form'

const mapStateToProps = (state, props) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    registerUser: (data) => dispatch(registerUser(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
