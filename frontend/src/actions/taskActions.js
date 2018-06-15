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

const FETCH_TASK_REQUESTED = 'FETCH_TASK_REQUESTED'
const FETCH_TASK_SUCCESS = 'FETCH_TASK_SUCCESS'
const FETCH_TASK_ERROR = 'FETCH_TASK_ERROR'

const LIST_TASK_REQUESTED = 'LIST_TASK_REQUESTED'
const LIST_TASK_SUCCESS = 'LIST_TASK_SUCCESS'
const LIST_TASK_ERROR = 'LIST_TASK_ERROR'

const FILTER_TASK_REQUESTED = 'FILTER_TASK_REQUESTED'
const FILTER_TASK_SUCCESS = 'FILTER_TASK_SUCCESS'

const PAYMENT_TASK_REQUESTED = 'PAYMENT_TASK_REQUESTED'
const PAYMENT_TASK_SUCCESS = 'PAYMENT_TASK_SUCCESS'
const PAYMENT_TASK_ERROR = 'PAYMENT_TASK_ERROR'

const CHANGE_TASK_TAB = 'CHANGE_TASK_TAB'

const VALIDATION_ERRORS = {
  'url must be unique': 'Essa url já foi cadastrada',
  'Not Found': 'Essa issue não foi encontrada no Github'
}

const ERROR_CODES = {
  'StatusCodeError': 'Issue não encontrada'
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

const createTaskError = (error) => {
  return { type: CREATE_TASK_ERROR, completed: true, error: error }
}

/*
 * Task update
 */

const updateTaskRequested = () => {
  return { type: UPDATE_TASK_REQUESTED, completed: false }
}

const updateTaskSuccess = (field) => {
  return { type: UPDATE_TASK_SUCCESS, completed: true, tab: field }
}

/*
 * Task list
 */

const listTaskRequested = () => {
  return { type: LIST_TASK_REQUESTED, completed: false }
}

const listTaskSuccess = (tasks) => {
  return { type: LIST_TASK_SUCCESS, completed: true, data: tasks.data }
}

const listTaskError = (error) => {
  return { type: LIST_TASK_ERROR, completed: true, error: error }
}

/*
 * Task filter
 */

const filterTaskRequested = () => {
  return { type: FILTER_TASK_REQUESTED, completed: false }
}

const filterTaskSuccess = (tasks) => {
  return { type: FILTER_TASK_SUCCESS, completed: true, data: tasks }
}

const filterTaskError = (error) => {
  return { type: FILTER_TASK_ERROR, completed: true, error: error }
}

/*
 * Task fetch
 */

const fetchTaskRequested = () => {
  return { type: FETCH_TASK_REQUESTED, completed: false }
}

const fetchTaskSuccess = (task) => {
  return { type: FETCH_TASK_SUCCESS, completed: true, data: task.data }
}

const fetchTaskError = (error) => {
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

const paymentTaskSuccess = (payment) => {
  return { type: PAYMENT_TASK_SUCCESS, completed: true, data: payment.data }
}

const paymentTaskError = (error) => {
  return { type: CREATE_TASK_ERROR, completed: true, error: error }
}

const changeTaskTab = (tab) => {
  return { type: CHANGE_TASK_TAB, tab: tab }
}

const createTask = (task, history) => {
  validToken()
  return (dispatch) => {
    dispatch(createTaskRequested())
    axios.post(api.API_URL + '/tasks/create', task).then((response) => {
      if (response.data && response.data.errors) {
        dispatch(addNotification(VALIDATION_ERRORS[response.data.errors[0].message]))
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
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      dispatch(addNotification('Erro ao atualizar tarefa'))
      return dispatch(createTaskError(error))
    })
  }
}

const updateTask = (task) => {
  validToken()
  return (dispatch, getState) => {
    dispatch(updateTaskRequested())
    const userId = getState().loggedIn.user.id
    if (!userId) {
      dispatch(addNotification('Você precisa estar logado'))
      return dispatch(updateTaskError({ message: 'Você precisa estar logado' }))
    }
    axios.put(api.API_URL + '/tasks/update', task).then((response) => {
      if (task.Orders) {
        dispatch(updateTaskSuccess(1))
      } else if (task.Assigns) {
        dispatch(updateTaskSuccess(2))
      } else {
        dispatch(updateTaskSuccess(0))
      }
      dispatch(addNotification('Tarefa atualizada com sucesso'))
      return dispatch(fetchTask(task.id))
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      dispatch(addNotification('Erro ao atualizar tarefa'))
      return dispatch(updateTaskError(error))
    })
  }
}

const listTasks = () => {
  validToken()
  return (dispatch, getState) => {
    dispatch(listTaskRequested())
    axios.get(api.API_URL + '/tasks/list')
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(response)
        return dispatch(listTaskSuccess(response))
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
        return dispatch(listTaskError(error))
      })
  }
}

const filterTasks = (key, value) => {
  validToken()
  return (dispatch, getState) => {
    dispatch(filterTaskRequested())
    const tasks = getState().tasks
    const filtered = tasks.data.filter((item) => item[key] === value)
    return dispatch(filterTaskSuccess(filtered))
  }
}

const fetchTask = (taskId) => {
  validToken()
  return (dispatch) => {
    dispatch(fetchTaskRequested())
    axios.get(api.API_URL + `/tasks/fetch/${taskId}`).then((task) => {
      if (task.data) {
        return dispatch(fetchTaskSuccess(task))
      }
      dispatch(addNotification('Não foi possível obter esta tarefa, por favor tente novamente mais tarde'))
      return dispatch(fetchTaskError({message: 'Tarefa não disponível no momento'}))
    }).catch((e) => {
      dispatch(addNotification('Não foi possível obter esta tarefa, por favor tente novamente mais tarde'))
      dispatch(fetchTaskError(e))
      // eslint-disable-next-line no-console
      console.log('not possible to fetch issue')
      // eslint-disable-next-line no-console
      console.log(e)
    })
  }
}

const paymentTask = (taskId) => {
  validToken()
  return (dispatch, getState) => {
    dispatch(paymentTaskRequested())
    const userId = getState().loggedIn.user.id
    if (!userId) {
      dispatch(addNotification('Você precisa estar logado'))
      return dispatch(paymentTaskError({ message: 'Você precisa estar logado' }))
    }
    axios.post(`${api.API_URL}/tasks/payments/`,{
      taskId: taskId
    }).then((payment) => {
      // dispatch(paymentTaskSuccess(payment))
      dispatch(addNotification('Transferência realizada com sucesso!'))
      return dispatch(fetchTask(taskId))
    }).catch((e) => {
      dispatch(addNotification('Não foi possível realizar o pagamento para esta tarefa'))
      dispatch(paymentTaskError(e))
      // eslint-disable-next-line no-console
      console.log('not possible to pay task')
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
  FETCH_TASK_REQUESTED,
  FETCH_TASK_SUCCESS,
  FETCH_TASK_ERROR,
  LIST_TASK_REQUESTED,
  LIST_TASK_SUCCESS,
  LIST_TASK_ERROR,
  FILTER_TASK_REQUESTED,
  FILTER_TASK_SUCCESS,
  PAYMENT_TASK_REQUESTED,
  PAYMENT_TASK_SUCCESS,
  PAYMENT_TASK_ERROR,
  CHANGE_TASK_TAB,
  addNotification,
  createTask,
  fetchTask,
  listTasks,
  filterTasks,
  updateTask,
  paymentTask,
  changeTaskTab
}
