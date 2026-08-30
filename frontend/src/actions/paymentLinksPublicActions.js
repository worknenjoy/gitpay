import api from '../consts'
import axios from 'axios'

const GET_PUBLIC_PAYMENT_LINKS_REQUESTED = 'GET_PUBLIC_PAYMENT_LINKS_REQUESTED'
const GET_PUBLIC_PAYMENT_LINKS_SUCCESS = 'GET_PUBLIC_PAYMENT_LINKS_SUCCESS'
const GET_PUBLIC_PAYMENT_LINKS_ERROR = 'GET_PUBLIC_PAYMENT_LINKS_ERROR'

/*
  Fetch a user's active, public payment links (Services tab / Provider payment links / packages)
*/

const getPublicPaymentLinksByUserRequested = () => {
  return { type: GET_PUBLIC_PAYMENT_LINKS_REQUESTED, completed: false }
}

const getPublicPaymentLinksByUserSuccess = (data) => {
  return { type: GET_PUBLIC_PAYMENT_LINKS_SUCCESS, completed: true, data }
}

const getPublicPaymentLinksByUserError = (error) => {
  return { type: GET_PUBLIC_PAYMENT_LINKS_ERROR, completed: true, error: error }
}

const getPublicPaymentLinksByUser = (userId) => {
  return (dispatch) => {
    dispatch(getPublicPaymentLinksByUserRequested())
    return axios
      .get(api.API_URL + `/payment-requests-public/user/${userId}`)
      .then((response) => {
        return dispatch(getPublicPaymentLinksByUserSuccess(response.data))
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('get public payment links error', e)
        return dispatch(getPublicPaymentLinksByUserError(e))
      })
  }
}

export {
  GET_PUBLIC_PAYMENT_LINKS_REQUESTED,
  GET_PUBLIC_PAYMENT_LINKS_SUCCESS,
  GET_PUBLIC_PAYMENT_LINKS_ERROR,
  getPublicPaymentLinksByUser
}
