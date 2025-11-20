import { connect } from 'react-redux'
import {
  updateUser,
  fetchAccount,
  fetchAccountCountries,
  deleteUser,
  createBankAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  updateBankAccount,
  getBankAccount
} from '../../../actions/userActions'
import { changePassword } from '../../../actions/loginActions'
import { addNotification } from '../../../actions/notificationActions'
import PayoutSettingsPage from '../../../components/areas/private/features/payout-settings/pages/payout-settings-bank-account-page'
import { getCurrentUser } from '../../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getCurrentUser(state),
    account: state.account,
    bankAccount: state.bankAccount,
    countries: state.countries
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addNotification: (notification: any) => dispatch(addNotification(notification)),
    updateUser: (user: any) => dispatch(updateUser(user)),
    fetchAccount: () => dispatch(fetchAccount()),
    fetchAccountCountries: () => dispatch(fetchAccountCountries()),
    changePassword: (password: any) => dispatch(changePassword(password)),
    deleteUser: (id: any) => dispatch(deleteUser(id)),
    createAccount: (account: any) => dispatch(createAccount(account)),
    updateAccount: (account) => dispatch(updateAccount(account)),
    deleteAccount: () => dispatch(deleteAccount()),
    createBankAccount: (bankAccount: any) => dispatch(createBankAccount(bankAccount)),
    updateBankAccount: (bankAccount: any) => dispatch(updateBankAccount(bankAccount)),
    getBankAccount: () => dispatch(getBankAccount())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayoutSettingsPage)
