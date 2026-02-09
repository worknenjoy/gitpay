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
  getBankAccount,
  deleteBankAccount
} from '../../../actions/userActions'
import { changePassword } from '../../../actions/loginActions'
import { addNotification } from '../../../actions/notificationActions'
import PayoutSettingsBankAccountInfoPage  from '../../../components/areas/private/features/payout-settings/pages/payout-settings-bank-account-info-page'
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
    addNotification: (notification: any, options: any) =>
      dispatch(addNotification(notification, options)),
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
    getBankAccount: () => dispatch(getBankAccount()),
    deleteBankAccount: (bankAccountId: string) => dispatch(deleteBankAccount(bankAccountId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayoutSettingsBankAccountInfoPage)
