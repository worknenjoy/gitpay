import { connect } from 'react-redux'
import PaymentRequestPayments from '../../components/areas/private/features/payment-requests/payment-request-payments'
import { fetchAccount } from '../../actions/userActions'
import {
  listPaymentRequestPayments,
  refundPaymentRequestPayment
} from '../../actions/paymentRequestPaymentActions'
import { getUserData } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getUserData(state),
    account: state.account,
    paymentRequestPayments: state.paymentRequestPayments
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchAccount: () => dispatch(fetchAccount()),
    listPaymentRequestPayments: () => dispatch(listPaymentRequestPayments()),
    refundPaymentRequestPayment: (id: any) => dispatch(refundPaymentRequestPayment(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequestPayments)
