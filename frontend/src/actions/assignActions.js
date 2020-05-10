import api from '../consts'
import axios from 'axios'

import { validToken } from './helpers'
import { addNotification } from './notificationActions'
import { fetchTask } from './taskActions'

/* Assign task */

const ASSIGN_TASK_REQUESTED = 'ASSIGN_TASK_REQUESTED'
const ASSIGN_TASK_SUCCESS = 'ASSIGN_TASK_SUCCESS'
const ASSIGN_TASK_ERROR = 'ASSIGN_TASK_ERROR'

const assignTaskRequested = () => {
  return { type: ASSIGN_TASK_REQUESTED, completed: false }
}

const assignTaskSuccess = tab => {
  return { type: ASSIGN_TASK_SUCCESS, completed: true, tab: tab }
}

const assignTaskError = error => {
  return { type: ASSIGN_TASK_ERROR, completed: true, error: error }
}

const assignTask = (taskId, assignId) => {
  return dispatch => {
    dispatch(assignTaskRequested())
    axios
      .post(api.API_URL + '/tasks/assignment/request', {
        taskId,
        assignId
      })
      .then(response => {
        dispatch(addNotification('actions.assign.task.sucess'))
        dispatch(assignTaskSuccess(2))
        return dispatch(fetchTask(taskId))
      })
      .catch(error => {
        dispatch(addNotification('actions.assign.task.error'))
        return dispatch(assignTaskError(error))
      })
  }
}

const actionAssign = (taskId, assignId, action, message) => {
  validToken()
  return (dispatch) => {
    dispatch(assignTaskRequested())
    axios
      .put(api.API_URL + '/tasks/assignment/request', {
        taskId,
        assignId,
        confirm: action,
        message
      })
      .then(response => {
        dispatch(addNotification('actions.assign.task.sucess'))
        dispatch(assignTaskSuccess(2))
        return dispatch(fetchTask(taskId))
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
        dispatch(addNotification('actions.assign.task.error'))
        return dispatch(assignTaskError(error))
      })
  }
}

/* Message before assign */

const MESSAGE_TASK_REQUESTED = 'MESSAGE_TASK_REQUESTED'
const MESSAGE_TASK_SUCCESS = 'MESSAGE_TASK_SUCCESSS'
const MESSAGE_TASK_ERROR = 'MESSAGE_TASK_ERROR'

const messageTaskRequested = () => {
  return { type: MESSAGE_TASK_REQUESTED, completed: false }
}

const messageTaskSuccess = tab => {
  return { type: MESSAGE_TASK_SUCCESS, completed: true, tab: tab }
}

const messageTaskError = error => {
  return { type: MESSAGE_TASK_ERROR, completed: true, error: error }
}

const messageTask = (taskId, assignId, message) => {
  return dispatch => {
    dispatch(messageTaskRequested())
    axios
      .post(`${api.API_URL}/tasks/${taskId}/message`, {
        message,
        interested: assignId
      })
      .then(response => {
        if (!response && !response.data) {
          dispatch(addNotification('actions.message.task.error'))
          return dispatch(messageTaskError('actions.message.task.error'))
        }
        dispatch(addNotification('actions.message.task.sucess'))
        dispatch(messageTaskSuccess(2))
        return dispatch(fetchTask(taskId))
      })
      .catch(error => {
        dispatch(addNotification('actions.message.task.error'))
        return dispatch(messageTaskError(error))
      })
  }
}

/**
 * Remove assignment actions.
 */

const REMOVE_ASSIGNMENT_REQUESTED = 'gitpay/assign/REMOVE_ASSIGNMENT_REQUESTED'
const REMOVE_ASSIGNMENT_SUCCESS = 'gitpay/assign/REMOVE_ASSIGNMENT_SUCCESS'
const REMOVE_ASSIGNMENT_ERROR = 'gitpay/assign/REMOVE_ASSIGNMENT_ERROR'

const removeAssignmentRequested = () => {
  return { type: REMOVE_ASSIGNMENT_REQUESTED, completed: false }
}

const removeAssignmentSuccess = tab => {
  return { type: REMOVE_ASSIGNMENT_SUCCESS, completed: true }
}

const removeAssignmentError = error => {
  return { type: REMOVE_ASSIGNMENT_ERROR, completed: true, error: error }
}

export const removeAssignment = (id, message) => dispatch => {
  dispatch(removeAssignmentRequested())
  axios
    .put(`${api.API_URL}/tasks/${id}/assignment/remove`, { message })
    .then(response => {
      dispatch(addNotification('action.task.remove.assign.success'))
      dispatch(removeAssignmentSuccess())
      return dispatch(fetchTask(id))
    })
    .catch(error => {
      dispatch(addNotification('action.task.remove.assign.error'))
      return dispatch(removeAssignmentError(error))
    })
}

export {
  ASSIGN_TASK_REQUESTED,
  ASSIGN_TASK_SUCCESS,
  ASSIGN_TASK_ERROR,
  MESSAGE_TASK_REQUESTED,
  MESSAGE_TASK_SUCCESS,
  MESSAGE_TASK_ERROR,
  assignTask,
  messageTask,
  actionAssign
}
