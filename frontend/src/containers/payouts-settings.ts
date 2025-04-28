import { connect } from 'react-redux';
import { updateUser, fetchAccount, fetchAccountCountries, deleteUser, createBankAccount, createAccount, updateAccount, updateBankAccount, getBankAccount } from '../actions/userActions';
import { changePassword } from '../actions/loginActions'
import { addNotification } from '../actions/notificationActions';
import PayoutSettings from '../components/areas/private/features/payouts/payout-settings';
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getUserData(state),
    account: state.account,
    bankAccount: state.bankAccount,
    countries: state.countries
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addNotification: (notification: any) => dispatch(addNotification(notification)),
    updateUser: (userId, user: any) => dispatch(updateUser(userId, user)),
    fetchAccount: () => dispatch(fetchAccount()),
    fetchAccountCountries: () => dispatch(fetchAccountCountries()),
    changePassword: (password: any) => dispatch(changePassword(password)),
    deleteUser: (id: any) => dispatch(deleteUser(id)),
    createAccount: (account: any) => dispatch(createAccount(account)),
    updateAccount: (account) => dispatch(updateAccount(account)),
    createBankAccount: (bankAccount: any) => dispatch(createBankAccount(bankAccount)),
    updateBankAccount: (bankAccount: any) => dispatch(updateBankAccount(bankAccount)),
    getBankAccount: () => dispatch(getBankAccount())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayoutSettings);