import { connect } from 'react-redux'
import Account from '../components/areas/private/account'
import {
  fetchAccount,
  createAccount,
  updateAccount,
  updateUser,
  createBankAccount,
  getBankAccount,
  updateBankAccount,
} from '../actions/userActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn,
    account: state.account,
    bankAccount: state.bankAccount,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAccount: (userId) => dispatch(fetchAccount(userId)),
    createAccount: (country) => dispatch(createAccount(country)),
    updateAccount: (userId, account) => dispatch(updateAccount(userId, account)),
    updateUser: (userId, user) => dispatch(updateUser(userId, user)),
    getBankAccount: (userId) => dispatch(getBankAccount(userId)),
    createBankAccount: (userId, bank) => dispatch(createBankAccount(userId, bank)),
    updateBankAccount: (bankAccount) => dispatch(updateBankAccount(bankAccount)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
