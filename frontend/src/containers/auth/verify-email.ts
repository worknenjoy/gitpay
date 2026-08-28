import { connect } from 'react-redux'
import { resendActivationEmail } from '../../actions/userActions'
import VerifyEmailPage from '../../components/design-library/pages/private-pages/verify-email-page/verify-email-page'

const mapStateToProps = (state: any) => ({
  completed: state.loggedIn.completed
})

const mapDispatchToProps = (dispatch: any) => ({
  onResend: () => dispatch(resendActivationEmail())
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailPage)
