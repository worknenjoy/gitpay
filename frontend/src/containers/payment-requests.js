import { connect } from 'react-redux'
import PaymentRequest from '../components/areas/private/features/payment-requests/payment-requests'
import {  createPaymentRequest, listPaymentRequests, updatePaymentRequest  } from '../actions/paymentRequestActions'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getUserData(state),
    paymentRequests: state.paymentRequests,
    paymentRequest: state.paymentRequest
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequest)
