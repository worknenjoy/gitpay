import { connect } from 'react-redux'
import { searchTransfer, updateTransfer, fetchTransfer } from '../../actions/transferActions'
import { listPaymentRequests } from '../../actions/paymentRequestActions'
import { fetchAccount } from '../../actions/userActions'
import Claims from '../../components/areas/private/features/claims/claims'
import { getUserData } from '../../common/selectors/user/getUser'
import { listPaymentRequestTransfers } from '../../actions/paymentRequestTransferActions'

const mapStateToProps = (state: any) => {
  return {
    user: getUserData(state),
    account: state.account,
    transfers: state.transfers,
    transfer: state.transfer,
    paymentRequestTransfers: state.paymentRequestTransfers
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchTransfer: (params: any) => dispatch(searchTransfer(params)),
    updateTransfer: (params: any) => dispatch(updateTransfer(params)),
    fetchTransfer: (id: any) => dispatch(fetchTransfer(id)),
    fetchAccount: () => dispatch(fetchAccount()),
    listPaymentRequests: (params: any) => dispatch(listPaymentRequests(params)),
    listPaymentRequestTransfers: (params: any) => dispatch(listPaymentRequestTransfers(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Claims)
