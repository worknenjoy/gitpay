import { connect } from 'react-redux'
import { activateUser, checkActivationStatus } from '../../actions/userActions'
import AccountActivation from '../../components/areas/public/features/session/pages/account-activation-page'

const mapDispatchToProps = (dispatch) => ({
  activateAccount: (token: string, userId: number) => dispatch(activateUser(userId, token)),
  checkStatus: (userId: number) => checkActivationStatus(userId)
})

export default connect(null, mapDispatchToProps)(AccountActivation)
