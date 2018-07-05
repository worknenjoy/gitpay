import api from '../consts'
import axios from 'axios'
import Auth from '../modules/auth'
import { addNotification } from './notificationActions'

const CREATE_ORDER_REQUESTED = 'CREATE_ORDER_REQUESTED'
const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS'
const CREATE_ORDER_ERROR = 'CREATE_ORDER_ERROR'

const PAY_ORDER_REQUESTED = 'PAY_ORDER_REQUESTED'
const PAY_ORDER_SUCCESS = 'PAY_ORDER_SUCCESS'
const PAY_ORDER_ERROR = 'PAY_ORDER_ERROR'

const validToken = () => {
  if (Auth.getToken()) {
    axios.defaults.headers.common['authorization'] = Auth.getToken()
  }

  return true
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

const payOrderSuccess = (payment) => {
  return { type: PAY_ORDER_SUCCESS, completed: true, payment: payment.data }
}

const payOrderError = error => {
  return { type: PAY_ORDER_ERROR, completed: true, error: error }
}

const createOrder = order => {
  validToken()
  return dispatch => {
    dispatch(createOrderRequested())
    axios
      .post(api.API_URL + `/orders/create`, order)
      .then(order => {
        if (order.data) {
          return dispatch(createOrderSuccess(order))
        } else {
          addNotification(
            'Não foi possível criar o pagamento'
          )
        }
        return dispatch(
          createOrderError({
            error: {
              type: 'create_order_failed'
            }
          })
        )
      })
      .catch(e => {
        dispatch(
          addNotification(
            'Não foi possível criar o pagamento para esta tarefa'
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
      .post(api.API_URL + `/orders/payment`, order)
      .then(payment => {
        console.log('payment for order', payment)
        if (payment.data) {
          addNotification(
            'Pagamento realizado com sucesso'
          )
          return dispatch(payOrderSuccess(payment))
        } else {
          addNotification(
            'Não foi possível realizar o pagamento'
          )
        }
        return dispatch(
          createOrderError({
            error: {
              type: 'create_order_failed'
            }
          })
        )
      })
      .catch(e => {
        dispatch(
          addNotification(
            'Não foi possível realizar o pagamento para esta tarefa'
          )
        )
        return dispatch(payOrderError(e))
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
  createOrder,
  payOrder
}
