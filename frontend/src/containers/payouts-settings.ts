import { connect } from 'react-redux';
import { updateUser, fetchAccount, deleteUser, createBankAccount, createAccount, updateBankAccount } from '../actions/userActions';
import { changePassword } from '../actions/loginActions'
import { addNotification } from '../actions/notificationActions';
import PayoutSettings from '../components/profile/pages/payout-settings';

const mapStateToProps = (state: any) => {
  return {
    user: state.loggedIn,
    account: state.account,
    bankAccount: state.bankAccount
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addNotification: (notification: any) => dispatch(addNotification(notification)),
    updateUser: (user: any) => dispatch(updateUser(user)),
    fetchAccount: () => dispatch(fetchAccount()),
    changePassword: (password: any) => dispatch(changePassword(password)),
    deleteUser: (id: any) => dispatch(deleteUser(id)),
    createAccount: (account: any) => dispatch(createAccount(account)),
    createBankAccount: (bankAccount: any) => dispatch(createBankAccount(bankAccount)),
    updateBankAccount: (bankAccount: any) => dispatch(updateBankAccount(bankAccount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayoutSettings);