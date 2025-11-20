import { connect } from 'react-redux'
import CheckoutForm from '../components/design-library/organisms/forms/payment-forms/credit-card-payment-form/credit-card-payment-form'
import { validateCoupon } from '../actions/couponActions'

const mapStateToProps = (state) => {
  return { couponStoreState: { ...state.couponReducer } }
}

const mapDispatchToProps = (dispatch) => {
  return {
    validateCoupon: (code, originalOrderPrice) => dispatch(validateCoupon(code, originalOrderPrice))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm)
