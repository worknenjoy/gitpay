import { connect } from 'react-redux'
import {
  fetchAccount,
  fetchAccountBalance,
  fetchAccountCountries,
  deleteAccount,
  fetchAccountVerificationLink
} from '../../../actions/userActions'
import { addNotification } from '../../../actions/notificationActions'
import PayoutSettingsWhopPage from '../../../components/areas/private/features/payout-settings/pages/payout-settings-whop-page'
import { getCurrentUser } from '../../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getCurrentUser(state),
    account: state.account,
    countries: state.countries
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchAccount: () => dispatch(fetchAccount('whop')),
    fetchAccountBalance: () => dispatch(fetchAccountBalance()),
    fetchAccountCountries: () => dispatch(fetchAccountCountries()),
    deleteAccount: () => dispatch(deleteAccount('whop')),
    fetchAccountVerificationLink: (purpose: string) =>
      dispatch(fetchAccountVerificationLink('whop', purpose)),
    addNotification: (notification: any, options: any) =>
      dispatch(addNotification(notification, options))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayoutSettingsWhopPage)
