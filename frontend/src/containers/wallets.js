import { connect } from 'react-redux'
import Wallets from '../components/profile/wallets'
import { fetchCustomer } from '../actions/userActions'
import { getUser } from '../common/selectors/user/getUser'
import { createWallet } from '../actions/walletActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getUser(state),
    customer: state.customer,
    wallets: state.wallets,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCustomer: (id) => dispatch(fetchCustomer(id)),
    createWallet: (wallet) => dispatch(createWallet(wallet)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallets)
