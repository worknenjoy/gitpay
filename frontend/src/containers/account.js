import { connect } from 'react-redux'
import Account from '../components/profile/account'
import { fetchAccount, createAccount, updateAccount } from '../actions/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.account.account,
    completed: state.account.completed
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAccount: () => {
      dispatch(fetchAccount())
    },
    createAccount: () => {
      dispatch(createAccount());
    },
    updateAccount: (account) => {
      dispatch(updateAccount(account));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
