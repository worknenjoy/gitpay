import api from '../consts'
import axios from 'axios'
import Auth from '../modules/auth'
import { addNotification } from './notificationActions'

const CREATE_TASK_REQUESTED = 'CREATE_TASK_REQUESTED'
const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS'
const CREATE_TASK_ERROR = 'CREATE_TASK_ERROR'

const UPDATE_TASK_REQUESTED = 'UPDATE_TASK_REQUESTED'
const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS'
const UPDATE_TASK_ERROR = 'UPDATE_TASK_ERROR'

const INVITE_TASK_REQUESTED = 'INVITE_TASK_REQUESTED'
const INVITE_TASK_SUCCESS = 'INVITE_TASK_SUCCESS'
const INVITE_TASK_ERROR = 'INVITE_TASK_ERROR'

const FETCH_TASK_REQUESTED = 'FETCH_TASK_REQUESTED'
const FETCH_TASK_SUCCESS = 'FETCH_TASK_SUCCESS'
const FETCH_TASK_ERROR = 'FETCH_TASK_ERROR'

const LIST_TASK_REQUESTED = 'LIST_TASK_REQUESTED'
const LIST_TASK_SUCCESS = 'LIST_TASK_SUCCESS'
const LIST_TASK_ERROR = 'LIST_TASK_ERROR'

const FILTER_TASK_REQUESTED = 'FILTER_TASK_REQUESTED'
const FILTER_TASK_SUCCESS = 'FILTER_TASK_SUCCESS'

const FILTER_TASK_ORDERS_REQUESTED = 'FILTER_TASK_ORDERS_REQUESTED'
const FILTER_TASK_ORDERS_SUCCESS = 'FILTER_TASK_ORDERS_SUCCESS'

const PAYMENT_TASK_REQUESTED = 'PAYMENT_TASK_REQUESTED'
const PAYMENT_TASK_SUCCESS = 'PAYMENT_TASK_SUCCESS'
const PAYMENT_TASK_ERROR = 'PAYMENT_TASK_ERROR'

const SYNC_TASK_REQUESTED = 'SYNC_TASK_REQUESTED'
const SYNC_TASK_SUCCESS = 'SYNC_TASK_SUCCESS'
const SYNC_TASK_ERROR = 'SYNC_TASK_ERROR'

const CHANGE_TASK_TAB = 'CHANGE_TASK_TAB'

const VALIDATION_ERRORS = {
  'url must be unique': 'Essa url já foi cadastrada',
  'Not Found': 'Essa issue não foi encontrada no Github'
}

const ERROR_CODES = {
  StatusCodeError: 'Issue não encontrada'
}

/*
 * Task create
 */

const createTaskRequested = () => {
  return { type: CREATE_TASK_REQUESTED, completed: false }
}

const createTaskSuccess = () => {
  return { type: CREATE_TASK_SUCCESS, completed: true }
}

const createTaskError = error => {
  return { type: CREATE_TASK_ERROR, completed: true, error: error }
}

/*
 * Task update
 */

const updateTaskRequested = () => {
  return { type: UPDATE_TASK_REQUESTED, completed: false }
}

const updateTaskSuccess = () => {
  return { type: UPDATE_TASK_SUCCESS, completed: true }
}

const updateTaskError = error => {
  return { type: UPDATE_TASK_ERROR, completed: true, error: error }
}

/*
*  Task invite
 */

const inviteTaskRequested = () => {
  return { type: INVITE_TASK_REQUESTED, completed: false }
}

const inviteTaskSuccess = () => {
  return { type: INVITE_TASK_SUCCESS, completed: true }
}

const inviteTaskError = error => {
  return { type: UPDATE_TASK_ERROR, completed: true, error }
}

/*
 * Task list
 */

const listTaskRequested = () => {
  return { type: LIST_TASK_REQUESTED, completed: false }
}

const listTaskSuccess = tasks => {
  return { type: LIST_TASK_SUCCESS, completed: true, data: tasks.data }
}

const listTaskError = error => {
  return { type: LIST_TASK_ERROR, completed: true, error: error }
}

/*
 * Tasks filter
 */

const filterTaskRequested = () => {
  return { type: FILTER_TASK_REQUESTED, completed: false }
}

const filterTaskSuccess = (tasks, filter, value) => {
  return {
    type: FILTER_TASK_SUCCESS,
    completed: true,
    data: tasks.data,
    filterType: filter,
    filterValue: value
  }
}

/*
 * Task order filter
 */

const filterTaskOrdersRequested = () => {
  return { type: FILTER_TASK_ORDERS_REQUESTED, completed: false }
}

const filterTaskOrdersSuccess = (task, filter) => {
  return {
    type: FILTER_TASK_ORDERS_SUCCESS,
    completed: true,
    data: task.data,
    filterOrdersBy: filter
  }
}

/*
 * Task fetch
 */

const fetchTaskRequested = () => {
  return { type: FETCH_TASK_REQUESTED, completed: false }
}

const fetchTaskSuccess = task => {
  return { type: FETCH_TASK_SUCCESS, completed: true, data: task.data }
}

const fetchTaskError = error => {
  return { type: FETCH_TASK_ERROR, completed: true, error: error }
}

/*
 * Task payment
*/

const validToken = () => {
  if (Auth.getToken()) {
    axios.defaults.headers.common['authorization'] = Auth.getToken()
  }

  return true
}

const paymentTaskRequested = () => {
  return { type: PAYMENT_TASK_REQUESTED, completed: false }
}

const paymentTaskSuccess = payment => {
  return { type: PAYMENT_TASK_SUCCESS, completed: true }
}

const paymentTaskError = error => {
  return { type: CREATE_TASK_ERROR, completed: true, error: error }
}

const changeTaskTab = tab => {
  return { type: CHANGE_TASK_TAB, tab: tab }
}

/*
 * Task sync
 */

const syncTaskRequested = () => {
  return { type: SYNC_TASK_REQUESTED, completed: false }
}

const syncTaskSuccess = values => {
  return { type: SYNC_TASK_SUCCESS, completed: true, values: values }
}

const syncTaskError = error => {
  return { type: SYNC_TASK_ERROR, completed: true, error: error }
}

const createTask = (task, history) => {
  validToken()
  return dispatch => {
    dispatch(createTaskRequested())
    axios
      .post(api.API_URL + '/tasks/create', task)
      .then(response => {
        if (response.data && response.data.errors) {
          dispatch(
            addNotification(VALIDATION_ERRORS[response.data.errors[0].message])
          )
          return dispatch(createTaskError(response.data.errors))
        }
        if (response.data && response.data.error) {
          dispatch(addNotification(ERROR_CODES[response.data.name]))
          return dispatch(createTaskError(JSON.parse(response.data.error)))
        }
        dispatch(createTaskSuccess())
        dispatch(addNotification('Tarefa criada com sucesso'))
        history.push(`/task/${response.data.id}`)
        return dispatch(fetchTask(response.data.id))
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
        dispatch(addNotification('Erro ao atualizar tarefa'))
        return dispatch(createTaskError(error))
      })
  }
}

const updateTask = task => {
  return (dispatch, getState) => {
    dispatch(updateTaskRequested())
    axios
      .put(api.API_URL + '/tasks/update', task)
      .then(response => {
        if (task.Orders) {
          dispatch(addNotification('Pagamento realizado com sucesso'))
          dispatch(changeTaskTab(1))
          dispatch(syncTask(task.id))
          dispatch(updateTaskSuccess())
        }
        else if (task.Assigns) {
          dispatch(
            addNotification('Você adicionou interesse pela tarefa com sucesso')
          )
          dispatch(changeTaskTab(2))
          dispatch(updateTaskSuccess())
        }
        else {
          dispatch(addNotification('Tarefa atualizada com sucesso'))
          dispatch(updateTaskSuccess())
        }
        return dispatch(fetchTask(task.id))
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
        if (error.response.data.type === 'StripeCardError') {
          dispatch(addNotification('Tivemos um erro ao processar o pagamento'))
          dispatch(changeTaskTab(1))
          return dispatch(updateTaskError(error.response.data))
        }
        dispatch(addNotification('Erro ao atualizar tarefa'))
        return dispatch(fetchTask(task.id))
      })
  }
}

const listTasks = () => {
  validToken()
  return (dispatch, getState) => {
    dispatch(listTaskRequested())
    axios
      .get(api.API_URL + '/tasks/list')
      .then(response => {
        return dispatch(listTaskSuccess(response))
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
        return dispatch(listTaskError(error))
      })
  }
}

const filterTasks = (key = 'all', value) => {
  return (dispatch, getState) => {
    const tasks = getState().tasks
    dispatch(filterTaskRequested())
    return dispatch(filterTaskSuccess(tasks, key, value))
  }
}

const filterTaskOrders = (filter = {}) => {
  return (dispatch, getState) => {
    const task = getState().task
    dispatch(filterTaskOrdersRequested())
    return dispatch(filterTaskOrdersSuccess(task, filter))
  }
}

const fetchTask = taskId => {
  validToken()
  return dispatch => {
    dispatch(fetchTaskRequested())
    axios
      .get(api.API_URL + `/tasks/fetch/${taskId}`)
      .then(task => {
        if (task.data) {
          return dispatch(fetchTaskSuccess(task))
        }
        dispatch(
          addNotification(
            'Não foi possível obter esta tarefa, por favor tente novamente mais tarde'
          )
        )
        return dispatch(
          fetchTaskError({ message: 'Tarefa não disponível no momento' })
        )
      })
      .catch(e => {
        dispatch(
          addNotification(
            'Não foi possível obter esta tarefa, por favor tente novamente mais tarde'
          )
        )
        dispatch(fetchTaskError(e))
        // eslint-disable-next-line no-console
        console.log('not possible to fetch issue')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

const paymentTask = (taskId, value) => {
  return (dispatch, getState) => {
    dispatch(paymentTaskRequested())
    axios
      .post(`${api.API_URL}/tasks/payments/`, {
        taskId: taskId,
        value: value
      })
      .then(payment => {
        if (payment.data.error) {
          if (payment.data.error.code === 'balance_insufficient') {
            dispatch(
              addNotification(
                'O valor ainda não está disponível para transferência'
              )
            )
          }
          else {
            dispatch(
              addNotification('Houve algum erro para realizar a transferência')
            )
          }
        }
        else {
          dispatch(addNotification('Transferência realizada com sucesso!'))
        }
        dispatch(paymentTaskSuccess(payment))
        return dispatch(fetchTask(taskId))
      })
      .catch(e => {
        dispatch(
          addNotification(
            'Não foi possível realizar o pagamento para esta tarefa'
          )
        )
        dispatch(paymentTaskError(e))
        // eslint-disable-next-line no-console
        console.log('not possible to pay task')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

const inviteTask = (id, email, message) => {
  return dispatch => {
    dispatch(inviteTaskRequested())
    axios
      .post(api.API_URL + `/tasks/${id}/invite/`, {
        email, message
      })
      .then(task => {
        if (task.status === 200) {
          dispatch(addNotification('Convite enviado com sucesso'))
          return dispatch(inviteTaskSuccess())
        }
        dispatch(addNotification('Não foi possível enviar o convite'))
        return dispatch(
          inviteTaskError({
            error: {
              type: 'task_invite_failed'
            }
          })
        )
      })
      .catch(e => {
        dispatch(
          addNotification(
            'Não foi possível enviar o convite'
          )
        )
        dispatch(inviteTaskError(e))
        // eslint-disable-next-line no-console
        console.log('not possible send invite')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

const syncTask = taskId => {
  return dispatch => {
    dispatch(syncTaskRequested())
    axios
      .get(api.API_URL + `/tasks/${taskId}/sync/value`)
      .then(task => {
        if (task.data) {
          return dispatch(syncTaskSuccess(task.data))
        }
        return dispatch(
          syncTaskError({
            error: {
              type: 'task_sync_failed'
            }
          })
        )
      })
      .catch(e => {
        dispatch(
          addNotification(
            'Não foi possível obter os valores pagos pela tarefa, por favor tente novamente mais tarde'
          )
        )
        dispatch(syncTaskError(e))
        // eslint-disable-next-line no-console
        console.log('not possible to fetch issue')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

export {
  CREATE_TASK_REQUESTED,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_ERROR,
  UPDATE_TASK_REQUESTED,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_ERROR,
  INVITE_TASK_REQUESTED,
  INVITE_TASK_SUCCESS,
  INVITE_TASK_ERROR,
  FETCH_TASK_REQUESTED,
  FETCH_TASK_SUCCESS,
  FETCH_TASK_ERROR,
  LIST_TASK_REQUESTED,
  LIST_TASK_SUCCESS,
  LIST_TASK_ERROR,
  FILTER_TASK_REQUESTED,
  FILTER_TASK_SUCCESS,
  FILTER_TASK_ORDERS_REQUESTED,
  FILTER_TASK_ORDERS_SUCCESS,
  PAYMENT_TASK_REQUESTED,
  PAYMENT_TASK_SUCCESS,
  PAYMENT_TASK_ERROR,
  SYNC_TASK_REQUESTED,
  SYNC_TASK_SUCCESS,
  SYNC_TASK_ERROR,
  CHANGE_TASK_TAB,
  addNotification,
  createTask,
  fetchTask,
  listTasks,
  filterTasks,
  filterTaskOrders,
  updateTask,
  paymentTask,
  syncTask,
  inviteTask,
  changeTaskTab
}
