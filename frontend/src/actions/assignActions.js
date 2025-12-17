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

const assignTaskSuccess = (tab) => {
  return { type: ASSIGN_TASK_SUCCESS, completed: true, tab: tab }
}

const assignTaskError = (error) => {
  return { type: ASSIGN_TASK_ERROR, completed: true, error: error }
}

const assignTask = (taskId, assignId) => {
  return (dispatch) => {
    dispatch(assignTaskRequested())
    axios
      .post(api.API_URL + '/tasks/assignment/request', {
        taskId,
        assignId
      })
      .then((response) => {
        dispatch(addNotification('actions.assign.task.sucess'))
        dispatch(assignTaskSuccess(2))
        return dispatch(fetchTask(taskId))
      })
      .catch((error) => {
        dispatch(addNotification('actions.assign.task.error', { severity: 'error' }))
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
      .then((response) => {
        dispatch(addNotification('actions.assign.task.sucess'))
        dispatch(assignTaskSuccess(2))
        return dispatch(fetchTask(taskId))
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
        dispatch(addNotification('actions.assign.task.error', { severity: 'error' }))
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

const messageTaskSuccess = (tab) => {
  return { type: MESSAGE_TASK_SUCCESS, completed: true, tab: tab }
}

const messageTaskError = (error) => {
  return { type: MESSAGE_TASK_ERROR, completed: true, error: error }
}

const messageTask = (taskId, assignId, message) => {
  return (dispatch) => {
    dispatch(messageTaskRequested())
    axios
      .post(`${api.API_URL}/tasks/${taskId}/message`, {
        message,
        interested: assignId
      })
      .then((response) => {
        if (!response && !response.data) {
          dispatch(addNotification('actions.message.task.error', { severity: 'error' }))
          return dispatch(messageTaskError('actions.message.task.error'))
        }
        dispatch(addNotification('actions.message.task.sucess'))
        dispatch(messageTaskSuccess(2))
        return dispatch(fetchTask(taskId))
      })
      .catch((error) => {
        dispatch(addNotification('actions.message.task.error', { severity: 'error' }))
        return dispatch(messageTaskError(error))
      })
  }
}

/** Message Offer actions */

const MESSAGE_OFFER_REQUESTED = 'MESSAGE_OFFER_REQUESTED'
const MESSAGE_OFFER_SUCCESS = 'MESSAGE_OFFER_SUCCESS'
const MESSAGE_OFFER_ERROR = 'MESSAGE_OFFER_ERROR'

const messageOfferRequested = () => {
  return { type: MESSAGE_OFFER_REQUESTED, completed: false }
}

const messageOfferSuccess = (tab) => {
  return { type: MESSAGE_OFFER_SUCCESS, completed: true, tab: tab }
}

const messageOfferError = (error) => {
  return { type: MESSAGE_OFFER_ERROR, completed: true, error: error }
}

const messageOffer = (taskId, offerId, message) => {
  return (dispatch) => {
    dispatch(messageOfferRequested())
    axios
      .post(`${api.API_URL}/tasks/${taskId}/offer/${offerId}/message`, {
        message,
        offerId: offerId
      })
      .then((response) => {
        if (!response && !response.data) {
          dispatch(addNotification('actions.message.task.error', { severity: 'error' }))
          return dispatch(messageOfferError('actions.message.task.error'))
        }
        dispatch(addNotification('actions.message.task.sucess'))
        dispatch(messageOfferSuccess(2))
        return dispatch(fetchTask(taskId))
      })
      .catch((error) => {
        dispatch(addNotification('actions.message.task.error', { severity: 'error' }))
        return dispatch(messageOfferError(error))
      })
  }
}

/*
 * Offer update actions
 */

const OFFER_UPDATE_REQUESTED = 'OFFER_UPDATE_REQUESTED'
const OFFER_UPDATE_SUCCESS = 'OFFER_UPDATE_SUCCESS'
const OFFER_UPDATE_ERROR = 'OFFER_UPDATE_ERROR'

const offerUpdateRequested = () => {
  return { type: OFFER_UPDATE_REQUESTED, completed: false }
}

const offerUpdateSuccess = (tab) => {
  return { type: OFFER_UPDATE_SUCCESS, completed: true, tab: tab }
}

const offerUpdateError = (error) => {
  return { type: OFFER_UPDATE_ERROR, completed: true, error: error }
}

const offerUpdate = (taskId, offerId, { status }) => {
  return (dispatch) => {
    dispatch(offerUpdateRequested())
    axios
      .put(`${api.API_URL}/offers/${offerId}`, {
        status
      })
      .then((response) => {
        if (!response) {
          dispatch(addNotification('actions.offer.update.error', { severity: 'error' }))
          return dispatch(offerUpdateError('actions.offer.update.error'))
        }
        dispatch(addNotification('actions.offer.update.sucess'))
        dispatch(offerUpdateSuccess(2))
        return dispatch(fetchTask(taskId))
      })
      .catch((error) => {
        dispatch(addNotification('actions.offer.update.error', { severity: 'error' }))
        return dispatch(offerUpdateError(error))
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

const removeAssignmentSuccess = (tab) => {
  return { type: REMOVE_ASSIGNMENT_SUCCESS, completed: true }
}

const removeAssignmentError = (error) => {
  return { type: REMOVE_ASSIGNMENT_ERROR, completed: true, error: error }
}

export const removeAssignment = (id, message) => (dispatch) => {
  dispatch(removeAssignmentRequested())
  axios
    .put(`${api.API_URL}/tasks/${id}/assignment/remove`, { message })
    .then((response) => {
      dispatch(addNotification('action.task.remove.assign.success'))
      dispatch(removeAssignmentSuccess())
      return dispatch(fetchTask(id))
    })
    .catch((error) => {
      dispatch(addNotification('action.task.remove.assign.error', { severity: 'error' }))
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
  MESSAGE_OFFER_REQUESTED,
  MESSAGE_OFFER_SUCCESS,
  MESSAGE_OFFER_ERROR,
  OFFER_UPDATE_REQUESTED,
  OFFER_UPDATE_SUCCESS,
  OFFER_UPDATE_ERROR,
  REMOVE_ASSIGNMENT_REQUESTED,
  REMOVE_ASSIGNMENT_SUCCESS,
  REMOVE_ASSIGNMENT_ERROR,
  assignTask,
  messageTask,
  messageOffer,
  offerUpdate,
  actionAssign
}
