import { connect } from 'react-redux'
import PaymentRequest from '../components/areas/private/features/payment-requests/payment-requests'
import {  createPaymentRequest, listPaymentRequests, updatePaymentRequest  } from '../actions/paymentRequestActions'
import { listPaymentRequestPayments } from '../actions/paymentRequestPaymentActions'
import { listPaymentRequestBalances } from '../actions/paymentRequestBalanceActions'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getUserData(state),
    paymentRequests: state.paymentRequests,
    paymentRequest: state.paymentRequest,
    paymentRequestPayments: state.paymentRequestPayments,
    paymentRequestBalances: state.paymentRequestBalances
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createPaymentRequest: (data) => {
      return dispatch(createPaymentRequest(data))
    },
    listPaymentRequests: () => {
      return dispatch(listPaymentRequests())
    },
    updatePaymentRequest: (paymentRequest) => {
      return dispatch(updatePaymentRequest(paymentRequest))
    },
    listPaymentRequestPayments: () => {
      return dispatch(listPaymentRequestPayments())
    },
    listPaymentRequestBalances: () => {
      return dispatch(listPaymentRequestBalances())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequest)
