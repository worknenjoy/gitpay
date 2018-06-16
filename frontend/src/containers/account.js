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
    updateAccount: (account) => dispatch(updateAccount(account)),
    getBankAccount: (userId) => dispatch(getBankAccount(userId)),
    createBankAccount: (bank) => dispatch(createBankAccount(bank))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
