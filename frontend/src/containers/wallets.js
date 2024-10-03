import { connect } from 'react-redux'
import Wallets from '../components/profile/wallets'
import { fetchCustomer } from '../actions/userActions'
import { getUser } from '../common/selectors/user/getUser'
import { createWallet, listWallets } from '../actions/walletActions'
import { createWalletOrder, listWalletOrders, fetchWalletOrder } from '../actions/walletOrderActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getUser(state),
    customer: state.customer,
    wallets: state.wallets,
    walletOrders: state.walletOrders,
    walletOrder: state.walletOrder,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCustomer: (id) => dispatch(fetchCustomer(id)),
    createWallet: (wallet) => dispatch(createWallet(wallet)),
    listWallets: () => dispatch(listWallets()),
    createWalletOrder: (walletOrder) => dispatch(createWalletOrder(walletOrder)),
    listWalletOrders: (walletId) => dispatch(listWalletOrders(walletId)),
    fetchWalletOrder: (id) => dispatch(fetchWalletOrder(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallets)
