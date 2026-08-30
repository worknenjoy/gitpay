import {
  GET_PUBLIC_PAYMENT_LINKS_REQUESTED,
  GET_PUBLIC_PAYMENT_LINKS_SUCCESS,
  GET_PUBLIC_PAYMENT_LINKS_ERROR
} from '../actions/paymentLinksPublicActions'

export const paymentLinksPublic = (state = { data: [], completed: true, error: {} }, action) => {
  switch (action.type) {
    case GET_PUBLIC_PAYMENT_LINKS_REQUESTED:
      return { ...state, completed: false }
    case GET_PUBLIC_PAYMENT_LINKS_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case GET_PUBLIC_PAYMENT_LINKS_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export default paymentLinksPublic
