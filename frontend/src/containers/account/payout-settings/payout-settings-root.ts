import { connect } from 'react-redux'
import { createAccount, fetchAccount, fetchAccountCountries } from '../../../actions/userActions'
import PayoutSettingsPage from '../../../components/areas/private/features/payout-settings/pages/payout-settings-page'
import { getCurrentUser } from '../../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getCurrentUser(state),
    account: state.account
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    createAccount: (country: string) => dispatch(createAccount(country)),
    fetchAccount: () => dispatch(fetchAccount()),
    fetchAccountCountries: () => dispatch(fetchAccountCountries())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayoutSettingsPage)
