import { connect } from 'react-redux'
import { authorizeGithub, disconnectGithub } from '../actions/loginActions'
import ProviderLoginButtons from '../components/areas/private/components/session/provider-login-buttons'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    authorizeGithub: () => dispatch(authorizeGithub()),
    disconnectGithub: () => dispatch(disconnectGithub())
  }
}

export default connect(null, mapDispatchToProps)(ProviderLoginButtons)
