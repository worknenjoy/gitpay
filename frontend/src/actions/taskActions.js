import api from '../consts'
import axios from 'axios'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const CREATE_TASK_REQUESTED = 'CREATE_TASK_REQUESTED'
const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS'
const CREATE_TASK_ERROR = 'CREATE_TASK_ERROR'

const UPDATE_TASK_REQUESTED = 'UPDATE_TASK_REQUESTED'
const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS'
const UPDATE_TASK_ERROR = 'UPDATE_TASK_ERROR'

const DELETE_TASK_REQUESTED = 'DELETE_TASK_REQUESTED'
const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS'
const DELETE_TASK_ERROR = 'DELETE_TASK_ERROR'

const MESSAGE_AUTHOR_REQUESTED = 'MESSAGE_AUTHOR_REQUESTED'
const MESSAGE_AUTHOR_SUCCESS = 'MESSAGE_AUTHOR_SUCCESS'
const MESSAGE_AUTHOR_ERROR = 'MESSAGE_AUTHOR_ERROR'

const INVITE_TASK_REQUESTED = 'INVITE_TASK_REQUESTED'
const INVITE_TASK_SUCCESS = 'INVITE_TASK_SUCCESS'
const INVITE_TASK_ERROR = 'INVITE_TASK_ERROR'

const FUNDING_INVITE_TASK_REQUESTED = 'FUNDING_INVITE_TASK_REQUESTED'
const FUNDING_INVITE_TASK_SUCCESS = 'FUNDING_INVITE_TASK_SUCCESS'
const FUNDING_INVITE_TASK_ERROR = 'FUNDING_INVITE_TASK_ERROR'

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

const REPORT_TASK_REQUESTED = 'REPORT_TASK_REQUESTED'
const REPORT_TASK_SUCCESS = 'REPORT_TASK_SUCCESS'
const REPORT_TASK_ERROR = 'REPORT_TASK_ERROR'

const CLAIM_TASK_REQUESTED = 'CLAIM_TASK_REQUESTED'
const CLAIM_TASK_SUCCESS = 'CLAIM_TASK_SUCCESS'
const CLAIM_TASK_ERROR = 'CLAIM_TASK_ERROR'

const VALIDATION_ERRORS = {
  'url must be unique': 'actions.task.create.validation.url',
  'Not Found': 'actions.task.create.validation.invalid'
}

const ERROR_CODES = {
  StatusCodeError: 'actions.task.issues.error.notfound'
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
*  Task message to author
 */

const messageAuthorRequested = () => {
  return { type: MESSAGE_AUTHOR_REQUESTED, completed: false }
}

const messageAuthorSuccess = () => {
  return { type: MESSAGE_AUTHOR_SUCCESS, completed: true }
}

const messageAuthorError = error => {
  return { type: MESSAGE_AUTHOR_ERROR, completed: true, error }
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
*  Task funding
 */

const fundingInviteTaskRequested = () => {
  return { type: FUNDING_INVITE_TASK_REQUESTED, completed: false }
}

const fundingInviteTaskSuccess = () => {
  return { type: FUNDING_INVITE_TASK_SUCCESS, completed: true }
}

const fundingInviteTaskError = error => {
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
 * Task delete
 */

const deleteTaskRequested = () => {
  return { type: DELETE_TASK_REQUESTED, completed: false }
}

const deleteTaskSuccess = () => {
  return { type: DELETE_TASK_SUCCESS, completed: true }
}

const deleteTaskError = error => {
  return { type: DELETE_TASK_ERROR, completed: true, error: error }
}
/*
 * Tasks filter
 */

const filterTaskRequested = () => {
  return { type: FILTER_TASK_REQUESTED, completed: false }
}

const filterTaskSuccess = (tasks, filter, value, additional) => {
  return {
    type: FILTER_TASK_SUCCESS,
    completed: true,
    data: tasks.data,
    filterType: filter,
    filterValue: value,
    filterAdditional: additional
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

/*
 * Task Report
 */

const reportTaskRequested = () => {
  return { type: REPORT_TASK_REQUESTED, completed: false }
}

const reportTaskSuccess = () => {
  return { type: REPORT_TASK_SUCCESS, completed: true }
}

const reportTaskError = error => {
  return { type: REPORT_TASK_ERROR, completed: true, error: error }
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
        dispatch(addNotification('actions.task.create.notification.success'))
        history.push(`/task/${response.data.id}`)
        return dispatch(fetchTask(response.data.id))
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        if (error.response && error.response.status === 403) {
          dispatch(addNotification('actions.task.create.auth.error'))
          return dispatch(createTaskError(error))
        }
        dispatch(addNotification('actions.task.create.notification.error'))
        return dispatch(createTaskError(error))
      })
  }
}

const updateTask = task => {
  return dispatch => {
    dispatch(updateTaskRequested())
    axios
      .put(api.API_URL + '/tasks/update', task)
      .then(response => {
        if (task.Orders.source_id) {
          dispatch(addNotification('actions.task.payment.notification.success'))
          dispatch(changeTaskTab(1))
          dispatch(syncTask(task.id))
          dispatch(updateTaskSuccess())
        }
        else if (task.Offer) {
          dispatch(
            addNotification('actions.task.interested.notification.success')
          )
          dispatch(changeTaskTab(2))
          dispatch(updateTaskSuccess())
        }
        else {
          dispatch(addNotification('actions.task.update.notification.error'))
          dispatch(updateTaskSuccess())
        }
        return dispatch(fetchTask(task.id))
      })
      .catch(error => {
        const errorResponse = error.response.data
        if (errorResponse.type === 'StripeCardError') {
          dispatch(addNotification('actions.task.payment.notification.error', `. ${errorResponse.message}`))
          dispatch(changeTaskTab(1))
          return dispatch(updateTaskError(errorResponse))
        }
        dispatch(addNotification('actions.task.update.notification.error'))
        return dispatch(fetchTask(task.id))
      })
  }
}

const deleteTask = task => {
  validToken()
  return dispatch => {
    dispatch(deleteTaskRequested())
    return axios
      .delete(api.API_URL + `/tasks/delete/${task.id}`, task)
      .then(response => {
        dispatch(deleteTaskSuccess())
        dispatch(addNotification('actions.task.delete.notification.success'))
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
        if (error.response && error.response.status === 403) {
          dispatch(addNotification('actions.task.delete.auth.error'))
          return dispatch(deleteTaskError(error))
        }
        dispatch(addNotification('actions.task.delete.notification.error'))
        return dispatch(deleteTaskError(error))
      })
  }
}

const listTasks = ({ organizationId, projectId, userId, status }) => {
  validToken()
  return (dispatch) => {
    dispatch(listTaskRequested())
    return axios
      .get(api.API_URL + '/tasks/list', {
        params: { organizationId, projectId, userId, status }
      })
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

const filterTasks = (key = 'all', value, additional) => {
  return (dispatch, getState) => {
    const tasks = getState().tasks
    dispatch(filterTaskRequested())
    return dispatch(filterTaskSuccess(tasks, key, value, additional))
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
          addNotification('actions.task.fetch.error')
        )
        return dispatch(
          fetchTaskError({ message: 'actions.task.fetch.unavailable' })
        )
      })
      .catch(e => {
        dispatch(
          addNotification('actions.task.fetch.other.error')
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
              addNotification('actions.task.payment.balance.error')
            )
          }
          else {
            dispatch(
              addNotification('actions.task.payment.balance.other.error')
            )
          }
        }
        else {
          dispatch(addNotification('actions.task.payment.transfer.sucess'))
        }
        dispatch(paymentTaskSuccess(payment))
        return dispatch(fetchTask(taskId))
      })
      .catch(e => {
        dispatch(
          addNotification('actions.task.payment.error.send')
        )
        dispatch(paymentTaskError(e))
        // eslint-disable-next-line no-console
        console.log('not possible to pay task')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

const inviteTask = (id, email, message, user) => {
  return dispatch => {
    const name = user.name
    dispatch(inviteTaskRequested())
    axios
      .post(api.API_URL + `/tasks/${id}/invite/`, {
        email, message, name
      })
      .then(task => {
        if (task.status === 200) {
          dispatch(addNotification('actions.task.invite.success'))
          return dispatch(inviteTaskSuccess())
        }
        dispatch(addNotification('actions.task.invite.error'))
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
          addNotification('actions.task.invite.error')
        )
        dispatch(inviteTaskError(e))
        // eslint-disable-next-line no-console
        console.log('not possible send invite')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

const messageAuthor = (userId, taskId, message) => {
  return dispatch => {
    dispatch(messageAuthorRequested())
    return axios
      .post(api.API_URL + `/tasks/${taskId}/message/author/`, {
        userId, message
      })
      .then(task => {
        if (task.status === 200) {
          dispatch(addNotification('actions.task.message.author.success'))
          return dispatch(messageAuthorSuccess())
        }
        dispatch(addNotification('actions.task.message.author.error'))
        return dispatch(
          messageAuthorError(
            { code: task.status }
          )
        )
      })
      .catch(e => {
        dispatch(
          addNotification('actions.task.message.author.error')
        )
        dispatch(inviteTaskError(e))
        // eslint-disable-next-line no-console
        console.log('not possible send invite')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

const fundingInviteTask = (id, email, comment, suggestedValue, suggestedDate, user) => {
  return dispatch => {
    const username = user.name
    dispatch(fundingInviteTaskRequested())
    axios
      .post(api.API_URL + `/tasks/${id}/funding/`, {
        email, comment, suggestedValue, suggestedDate, username
      })
      .then(task => {
        if (task.status === 200) {
          dispatch(addNotification('actions.task.invite.success'))
          return dispatch(fundingInviteTaskSuccess())
        }
        dispatch(addNotification('actions.task.invite.error'))
        return dispatch(
          fundingInviteTaskError({
            error: {
              type: 'task_invite_failed'
            }
          })
        )
      })
      .catch(e => {
        dispatch(
          addNotification('actions.task.invite.error')
        )
        dispatch(fundingInviteTaskError(e))
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
          addNotification('actions.task.fetch.other.error')
        )
        dispatch(syncTaskError(e))
        // eslint-disable-next-line no-console
        console.log('not possible to fetch issue')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

const reportTask = (task, reason) => {
  return dispatch => {
    dispatch(reportTaskRequested())
    return axios
      .post(api.API_URL + `/tasks/${task.id}/report`, {
        task, reason, baseUrl: api.API_URL
      })
      .then(task => {
        if (task.status === 200) {
          dispatch(addNotification('actions.task.report.success'))
          return dispatch(reportTaskSuccess())
        }
        dispatch(addNotification('actions.task.report.error'))
        return dispatch(
          reportTaskError({
            error: {
              type: 'task_report_failed'
            }
          })
        )
      })
      .catch(e => {
        dispatch(
          addNotification('actions.task.report.error')
        )
        dispatch(reportTaskError(e))
        // eslint-disable-next-line no-console
        console.log('not possible to send report')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

/*
 * Task Claim
 */

const requestClaimTaskRequested = () => {
  return { type: CLAIM_TASK_REQUESTED, completed: false }
}

const requestClaimTaskSuccess = () => {
  return { type: CLAIM_TASK_SUCCESS, completed: true }
}

const requestClaimTaskError = error => {
  return { type: CLAIM_TASK_ERROR, completed: true, error: error }
}

const requestClaimTask = (taskId, userId, comments, isApproved, token, history) => {
  return dispatch => {
    dispatch(requestClaimTaskRequested())
    return axios
      .post(api.API_URL + `/tasks/${taskId}/claim`, {
        taskId, userId, comments, isApproved, token: token, baseUrl: api.API_URL
      })
      .then(task => {
        if (task.status === 200 && !task.data && !task.data.error) {
          dispatch(addNotification('actions.task.claim.success'))
          if (isApproved) {
            history.push(`/task/${taskId}`)
            return dispatch(fetchTask(taskId))
          }
          return dispatch(requestClaimTaskSuccess())
        }

        if (task.data.error === 'user_is_not_the_owner') {
          dispatch(addNotification('actions.task.claim.error.user_is_not_the_owner'))
        }
        else if (task.data.error === 'invalid_provider') {
          dispatch(addNotification('actions.task.claim.error.invalid_provider'))
        }
        else {
          dispatch(addNotification('actions.task.claim.error'))
        }
        return dispatch(
          requestClaimTaskError({
            error: {
              type: 'task_claim_failed'
            }
          })
        )
      })
      .catch(e => {
        dispatch(
          addNotification('actions.task.claim.error')
        )
        dispatch(requestClaimTaskError(e))
        // eslint-disable-next-line no-console
        console.log('not possible request claim')
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
  DELETE_TASK_REQUESTED,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_ERROR,
  INVITE_TASK_REQUESTED,
  INVITE_TASK_SUCCESS,
  INVITE_TASK_ERROR,
  MESSAGE_AUTHOR_REQUESTED,
  MESSAGE_AUTHOR_SUCCESS,
  MESSAGE_AUTHOR_ERROR,
  FUNDING_INVITE_TASK_REQUESTED,
  FUNDING_INVITE_TASK_SUCCESS,
  FUNDING_INVITE_TASK_ERROR,
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
  REPORT_TASK_REQUESTED,
  REPORT_TASK_SUCCESS,
  REPORT_TASK_ERROR,
  CLAIM_TASK_REQUESTED,
  CLAIM_TASK_SUCCESS,
  CLAIM_TASK_ERROR,
  addNotification,
  createTask,
  fetchTask,
  listTasks,
  listTaskSuccess,
  filterTasks,
  filterTaskOrders,
  updateTask,
  deleteTask,
  paymentTask,
  syncTask,
  inviteTask,
  messageAuthorRequested,
  messageAuthorSuccess,
  messageAuthorError,
  messageAuthor,
  fundingInviteTask,
  changeTaskTab,
  reportTask,
  requestClaimTask
}
