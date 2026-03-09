import { connect } from 'react-redux'
import PaymentRequestBalances from '../../components/areas/private/features/payment-requests/payment-request-balances'
import { fetchAccount } from '../../actions/userActions'
import { listPaymentRequestBalances } from '../../actions/paymentRequestBalanceActions'
import { getUserData } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getUserData(state),
    account: state.account,
    paymentRequestBalances: state.paymentRequestBalances
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchAccount: () => dispatch(fetchAccount()),
    listPaymentRequestBalances: () => dispatch(listPaymentRequestBalances())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequestBalances)
