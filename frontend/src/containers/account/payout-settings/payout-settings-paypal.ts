import { connect } from 'react-redux'
import { updateUser } from '../../../actions/userActions'
import PayoutSettingsPaypalPage from '../../../components/areas/private/features/payout-settings/pages/payout-settings-paypal-page'
import { getCurrentUser } from '../../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getCurrentUser(state),
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateUser: (user: any) => dispatch(updateUser(user)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayoutSettingsPaypalPage)
