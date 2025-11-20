import {
  VALIDATE_COUPON_REQUESTED,
  VALIDATE_COUPON_SUCCESS,
  VALIDATE_COUPON_ERROR,
} from '../actions/couponActions'

const initialState = {
  coupon: {},
  completed: false,
  error: { message: false },
}

export const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    case VALIDATE_COUPON_REQUESTED:
      return { ...state, completed: action.completed }
    case VALIDATE_COUPON_SUCCESS:
      return { ...state, completed: action.completed, coupon: action.coupon }
    case VALIDATE_COUPON_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}

export default couponReducer
