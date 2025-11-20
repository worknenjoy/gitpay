import api from '../consts'
import axios from 'axios'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const VALIDATE_COUPON_REQUESTED = 'VALIDATE_COUPON_REQUESTED'
const VALIDATE_COUPON_SUCCESS = 'VALIDATE_COUPON_SUCCESS'
const VALIDATE_COUPON_ERROR = 'VALIDATE_COUPON_ERROR'

const validateCouponRequested = () => {
  return { type: VALIDATE_COUPON_REQUESTED, completed: false }
}

const validateCouponSuccess = (couponData) => {
  return { type: VALIDATE_COUPON_SUCCESS, completed: true, coupon: couponData }
}

const validateCouponError = (error) => {
  return { type: VALIDATE_COUPON_ERROR, completed: true, error: error }
}

const ERRORS = {
  COUPON_FAILED: 'coupon.failed',
  COUPON_DOES_NOT_EXISTS: 'coupon.notFound',
  COUPON_MAX_TIMES_EXCEEDED: 'coupon.maxTimesExceeded',
}

const validateCoupon = (couponCode, originalOrderPrice) => {
  validToken()
  return (dispatch) => {
    dispatch(validateCouponRequested())

    const payload = {
      code: couponCode,
      originalOrderPrice: originalOrderPrice,
    }

    axios
      .post(`${api.API_URL}/coupon/validate`, payload)
      .then((response) => {
        if (Object.keys(response.data).length === 0) {
          dispatch(addNotification(ERRORS['COUPON_DOES_NOT_EXISTS']))
        }

        dispatch(validateCouponSuccess(response.data))
      })
      .catch((err) => {
        if (err.response.data && err.response.data.error) {
          dispatch(addNotification(ERRORS[err.response.data.error]))
          return dispatch(validateCouponError(JSON.parse(err.response.data.error)))
        }

        dispatch(addNotification(ERRORS['COUPON_FAILED']))
        return dispatch(validateCouponError(JSON.parse(ERRORS['COUPON_FAILED'])))
      })
  }
}

export { validateCoupon, VALIDATE_COUPON_REQUESTED, VALIDATE_COUPON_SUCCESS, VALIDATE_COUPON_ERROR }
