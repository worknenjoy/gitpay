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

const TRANSFER_ORDER_REQUESTED = 'TRANSFER_ORDER_REQUESTED'
const TRANSFER_ORDER_SUCCESS = 'TRANSFER_ORDER_SUCCESS'
const TRANSFER_ORDER_ERROR = 'TRANSFER_ORDER_ERROR'

const CANCEL_ORDER_REQUESTED = 'CANCEL_ORDER_REQUESTED'
const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS'
const CANCEL_ORDER_ERROR = 'CANCEL_ORDER_ERROR'

const DETAILS_ORDER_REQUESTED = 'DETAILS_ORDER_REQUESTED'
const DETAILS_ORDER_SUCCESS = 'DETAILS_ORDER_SUCCESS'
const DETAILS_ORDER_ERROR = 'DETAILS_ORDER_ERROR'

const REFUND_ORDER_REQUESTED = 'REFUND_ORDER_REQUESTED'
const REFUND_ORDER_SUCCESS = 'REFUND_ORDER_SUCCESS'
const REFUND_ORDER_ERROR = 'REFUND_ORDER_ERROR'


const LIST_ORDERS_REQUESTED = 'LIST_ORDERS_REQUESTED'
const LIST_ORDERS_SUCCESS = 'LIST_ORDERS_SUCCESS'
const LIST_ORDERS_ERROR = 'LIST_ORDERS_ERROR'

/*
 * Order list
 */

const listOrdersRequested = () => {
  return { type: LIST_ORDERS_REQUESTED, completed: false }
}

const listOrdersSuccess = (orders) => {
  return { type: LIST_ORDERS_SUCCESS, completed: true, data: orders }
}

const listOrdersError = error => {
  return { type: LIST_ORDERS_ERROR, completed: true, error: error }
}

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
 * Order refund
 */

const refundOrderRequested = () => {
  return { type: REFUND_ORDER_REQUESTED, completed: false }
}

const refundOrderSuccess = order => {
  return { type: REFUND_ORDER_SUCCESS, completed: true, order }
}

const refundOrderError = error => {
  return { type: REFUND_ORDER_SUCCESS, completed: true, error: error }
}

/*
 * Order transfer
 */

const transferOrderRequested = () => {
  return { type: TRANSFER_ORDER_REQUESTED, completed: false }
}

const transferOrderSuccess = order => {
  return { type: TRANSFER_ORDER_SUCCESS, completed: true, order }
}

const transferOrderError = error => {
  return { type: TRANSFER_ORDER_SUCCESS, completed: true, error: error }
}

/*
*
* Async actions
*
*/

const listOrders = query => {
  return dispatch => {
    dispatch(listOrdersRequested())
    return axios
      .get(api.API_URL + '/orders/list', { params: query })
      .then(orders => {
        if (orders.data) {
          return dispatch(listOrdersSuccess(orders.data))
        }
        else {
          addNotification('actions.order.list.error')
        }
        return dispatch(
          listOrdersError({
            error: {
              type: 'create_order_failed'
            }
          })
        )
      })
      .catch(e => {
        dispatch(
          addNotification(
            'actions.order.list.error'
          )
        )
        return dispatch(listOrdersError(e))
      })
  }
}

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

const transferOrder = (order, params) => {
  validToken()
  return dispatch => {
    dispatch(transferOrderRequested())
    axios
      .post(api.API_URL + `/orders/transfer/${order.id}`, params)
      .then(order => {
        // eslint-disable-next-line no-console
        console.log('payment for order', order)
        if (order.data) {
          dispatch(addNotification(
            'actions.order.transfer.success'
          ))
          dispatch(transferOrderSuccess(order))
          return dispatch(fetchTask(order.data[1].TaskId))
        }
        else {
          dispatch(addNotification('actions.order.transfer.error'))
          return dispatch(
            transferOrderError(new Error('transfer_order_failed'))
          )
        }
      })
      .catch(e => {
        dispatch(
          addNotification(
            'actions.order.transfer.error'
          )
        )
        return dispatch(transferOrderError(e))
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

const refundOrder = id => {
  validToken()
  return dispatch => {
    dispatch(refundOrderRequested())
    return axios
      .get(api.API_URL + '/orders/refund/' + id)
      .then(order => {
        if (order.data) {
          dispatch(addNotification('actions.order.refund.success'))
          return dispatch(refundOrderSuccess(order.data))
        }
        else {
          dispatch(addNotification('actions.order.refund.error'))
          return dispatch(refundOrderError(new Error('detail_order_failed')))
        }
      })
      .catch(e => {
        dispatch(
          addNotification(
            'actions.order.cancel.payment.error'
          )
        )
        return dispatch(refundOrderError(e))
      })
  }
}

export {
  LIST_ORDERS_REQUESTED,
  LIST_ORDERS_SUCCESS,
  LIST_ORDERS_ERROR,
  CREATE_ORDER_REQUESTED,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
  PAY_ORDER_REQUESTED,
  PAY_ORDER_SUCCESS,
  PAY_ORDER_ERROR,
  TRANSFER_ORDER_REQUESTED,
  TRANSFER_ORDER_SUCCESS,
  TRANSFER_ORDER_ERROR,
  CANCEL_ORDER_REQUESTED,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_ERROR,
  DETAILS_ORDER_REQUESTED,
  DETAILS_ORDER_SUCCESS,
  DETAILS_ORDER_ERROR,
  REFUND_ORDER_REQUESTED,
  REFUND_ORDER_SUCCESS,
  REFUND_ORDER_ERROR,
  listOrders,
  createOrder,
  payOrder,
  transferOrder,
  refundOrder,
  cancelOrder,
  detailOrder
}
