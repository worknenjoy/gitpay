import api from '../consts'
import axios from 'axios'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'
import { fetchTask } from './taskActions'

const CREATE_ORDER_REQUESTED = 'CREATE_ORDER_REQUESTED'
const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS'
const CREATE_ORDER_ERROR = 'CREATE_ORDER_ERROR'

const PAY_ORDER_REQUESTED = 'PAY_ORDER_REQUESTED'
const PAY_ORDER_SUCCESS = 'PAY_ORDER_SUCCESS'
const PAY_ORDER_ERROR = 'PAY_ORDER_ERROR'

const CANCEL_ORDER_REQUESTED = 'CANCEL_ORDER_REQUESTED'
const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS'
const CANCEL_ORDER_ERROR = 'CANCEL_ORDER_ERROR'

const DETAILS_ORDER_REQUESTED = 'DETAILS_ORDER_REQUESTED'
const DETAILS_ORDER_SUCCESS = 'DETAILS_ORDER_SUCCESS'
const DETAILS_ORDER_ERROR = 'DETAILS_ORDER_ERROR'

/*
 * Order create
 */

const createOrderRequested = () => {
  return { type: CREATE_ORDER_REQUESTED, completed: false }
}

const createOrderSuccess = (order) => {
  return { type: CREATE_ORDER_SUCCESS, completed: true, data: order.data }
}

const createOrderError = error => {
  return { type: CREATE_ORDER_ERROR, completed: true, error: error }
}

/*
 * Order pay
 */

const payOrderRequested = () => {
  return { type: PAY_ORDER_REQUESTED, completed: false }
}

const payOrderSuccess = order => {
  return { type: PAY_ORDER_SUCCESS, completed: true, order }
}

const payOrderError = error => {
  return { type: PAY_ORDER_ERROR, completed: true, error: error }
}

/*
 * Order cancel
 */

const cancelOrderRequested = () => {
  return { type: CANCEL_ORDER_REQUESTED, completed: false }
}

const cancelOrderSuccess = order => {
  return { type: CANCEL_ORDER_SUCCESS, completed: true, order }
}

const cancelOrderError = error => {
  return { type: CANCEL_ORDER_ERROR, completed: true, error: error }
}

/*
 * Order details
 */

const detailOrderRequested = () => {
  return { type: DETAILS_ORDER_REQUESTED, completed: false }
}

const detailOrderSuccess = order => {
  return { type: DETAILS_ORDER_SUCCESS, completed: true, order }
}

const detailOrderError = error => {
  return { type: DETAILS_ORDER_SUCCESS, completed: true, error: error }
}

/*
*
* Async actions
*
*/

const createOrder = order => {
  return dispatch => {
    dispatch(createOrderRequested())
    return axios
      .post(api.API_URL + '/orders/create', order)
      .then(order => {
        if (order.data) {
          return dispatch(createOrderSuccess(order))
        }
        else {
          addNotification('actions.order.create.error')
        }
        return dispatch(
          payOrderError({
            error: {
              type: 'create_order_failed'
            }
          })
        )
      })
      .catch(e => {
        dispatch(
          addNotification(
            'actions.order.create.payment.error'
          )
        )
        return dispatch(createOrderError(e))
      })
  }
}

const payOrder = order => {
  validToken()
  return dispatch => {
    dispatch(payOrderRequested())
    axios
      .post(api.API_URL + '/orders/payment', order)
      .then(order => {
        // eslint-disable-next-line no-console
        console.log('payment for order', order)
        if (order.data.transfer_id) {
          dispatch(addNotification(
            'actions.order.create.payment.send.success'
          ))
          dispatch(payOrderSuccess(order))
          return dispatch(fetchTask(order.data.TaskId))
        }
        else {
          dispatch(addNotification('actions.order.create.payment.send.error'))
          return dispatch(
            payOrderError(new Error('pay_order_failed'))
          )
        }
      })
      .catch(e => {
        dispatch(
          addNotification(
            'actions.order.create.payment.send.error'
          )
        )
        return dispatch(payOrderError(e))
      })
  }
}

const cancelOrder = id => {
  validToken()
  return dispatch => {
    dispatch(cancelOrderRequested())
    return axios
      .post(api.API_URL + '/orders/cancel', { id })
      .then(order => {
        if (order.data) {
          dispatch(addNotification('actions.order.cancel.success'))
          dispatch(cancelOrderSuccess(order))
          return dispatch(fetchTask(order.data.TaskId))
        }
        else {
          addNotification('actions.order.cancel.error')
          return dispatch(cancelOrderError(new Error('cancel_order_failed')))
        }
      })
      .catch(e => {
        dispatch(
          addNotification(
            'actions.order.cancel.payment.error'
          )
        )
        return dispatch(cancelOrderError(e))
      })
  }
}

const detailOrder = id => {
  validToken()
  return dispatch => {
    dispatch(detailOrderRequested())
    return axios
      .get(api.API_URL + '/orders/details/' + id)
      .then(order => {
        if (order.data) {
          return dispatch(detailOrderSuccess(order.data))
        }
        else {
          addNotification('actions.order.cancel.error')
          return dispatch(detailOrderError(new Error('detail_order_failed')))
        }
      })
      .catch(e => {
        dispatch(
          addNotification(
            'actions.order.cancel.payment.error'
          )
        )
        return dispatch(cancelOrderError(e))
      })
  }
}

export {
  CREATE_ORDER_REQUESTED,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
  PAY_ORDER_REQUESTED,
  PAY_ORDER_SUCCESS,
  PAY_ORDER_ERROR,
  CANCEL_ORDER_REQUESTED,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_ERROR,
  DETAILS_ORDER_REQUESTED,
  DETAILS_ORDER_SUCCESS,
  DETAILS_ORDER_ERROR,
  createOrder,
  payOrder,
  cancelOrder,
  detailOrder
}
