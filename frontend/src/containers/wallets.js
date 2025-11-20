import { connect } from 'react-redux'
import Wallets from '../components/areas/private/features/wallets/wallets'
import { fetchCustomer } from '../actions/userActions'
import { getUserData } from '../common/selectors/user/getUser'
import { createWallet, listWallets, fetchWallet } from '../actions/walletActions'
import {
  createWalletOrder,
  listWalletOrders,
  fetchWalletOrder,
} from '../actions/walletOrderActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getUserData(state),
    customer: state.customer,
    wallets: state.wallets,
    wallet: state.wallet,
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
    fetchWallet: (id) => dispatch(fetchWallet(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallets)
