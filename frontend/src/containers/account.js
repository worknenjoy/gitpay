import { connect } from 'react-redux'
import Account from '../components/profile/account'
import { fetchAccount, createAccount, updateAccount, createBankAccount, getBankAccount } from '../actions/userActions'

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.account,
    bankAccount: state.bankAccount
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAccount: () => dispatch(fetchAccount()),
    createAccount: () => dispatch(createAccount()),
    updateAccount: (account) => dispatch(updateAccount(account)),
    getBankAccount: () => dispatch(getBankAccount()),
    createBankAccount: (bank) => dispatch(createBankAccount(bank))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
