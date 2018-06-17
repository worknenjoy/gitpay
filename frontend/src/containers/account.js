import { connect } from 'react-redux'
import Account from '../components/profile/account'
import { fetchAccount, createAccount, updateAccount, createBankAccount, getBankAccount } from '../actions/userActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn,
    account: state.account,
    bankAccount: state.bankAccount
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAccount: (userId) => dispatch(fetchAccount(userId)),
    createAccount: (userId) => dispatch(createAccount(userId)),
    updateAccount: (userId, account) => dispatch(updateAccount(userId, account)),
    getBankAccount: (userId) => dispatch(getBankAccount(userId)),
    createBankAccount: (userId, bank) => dispatch(createBankAccount(userId, bank))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
