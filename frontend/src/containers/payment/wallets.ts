import { connect } from 'react-redux'
import Wallets from '../../components/areas/private/features/wallets/wallets'
import { fetchCustomer } from '../../actions/userActions'
import { getUserData } from '../../common/selectors/user/getUser'
import { createWallet, listWallets, fetchWallet } from '../../actions/walletActions'
import {
  createWalletOrder,
  listWalletOrders,
  fetchWalletOrder
} from '../../actions/walletOrderActions'

const mapStateToProps = (state: any, ownProps?: any) => {
  return {
    user: getUserData(state),
    customer: state.customer,
    wallets: state.wallets,
    wallet: state.wallet,
    walletOrders: state.walletOrders,
    walletOrder: state.walletOrder
  }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => {
  return {
    fetchCustomer: () => dispatch(fetchCustomer()),
    createWallet: (wallet: any) => dispatch(createWallet(wallet)),
    listWallets: () => dispatch(listWallets()),
    createWalletOrder: (walletOrder: any) => dispatch(createWalletOrder(walletOrder)),
    listWalletOrders: (walletId: any) => dispatch(listWalletOrders(walletId)),
    fetchWalletOrder: (id: any) => dispatch(fetchWalletOrder(id)),
    fetchWallet: (id: any) => dispatch(fetchWallet(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallets)
