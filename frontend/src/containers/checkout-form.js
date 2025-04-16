import { connect } from 'react-redux'
import CheckoutForm from '../components/areas/private/features/payments/checkout/checkout-form'
import { validateCoupon } from '../actions/couponActions'

const mapStateToProps = state => {
  return { couponStoreState: { ...state.couponReducer } }
}

const mapDispatchToProps = dispatch => {
  return {
    validateCoupon: (code, originalOrderPrice) => dispatch(validateCoupon(code, originalOrderPrice))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm)
