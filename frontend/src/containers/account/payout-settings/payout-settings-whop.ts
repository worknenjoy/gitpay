import { connect } from 'react-redux'
import {
  fetchAccount,
  fetchAccountBalance,
  deleteAccount,
  fetchAccountVerificationLink
} from '../../../actions/userActions'
import PayoutSettingsWhopPage from '../../../components/areas/private/features/payout-settings/pages/payout-settings-whop-page'
import { getCurrentUser } from '../../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getCurrentUser(state),
    account: state.account
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchAccount: () => dispatch(fetchAccount('whop')),
    fetchAccountBalance: () => dispatch(fetchAccountBalance()),
    deleteAccount: () => dispatch(deleteAccount('whop')),
    fetchAccountVerificationLink: () => dispatch(fetchAccountVerificationLink('whop'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayoutSettingsWhopPage)
