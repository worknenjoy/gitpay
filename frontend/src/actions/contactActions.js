import api from '../consts'
import axios from 'axios'
import { addNotification } from './notificationActions'

const MESSAGE_RECRUITERS_REQUESTED = 'MESSAGE_RECRUITERS_REQUESTED'
const MESSAGE_RECRUITERS_SUCCESS = 'MESSAGE_RECRUITERS_SUCCESS'
const MESSAGE_RECRUITERS_ERROR = 'MESSAGE_RECRUITERS_ERROR'

const messageRecruitersRequested = () => {
  return { type: MESSAGE_RECRUITERS_REQUESTED, completed: false }
}

const messageRecruitersSuccess = () => {
  return { type: MESSAGE_RECRUITERS_SUCCESS, completed: true }
}

const messageRecruitersError = (error) => {
  return { type: MESSAGE_RECRUITERS_ERROR, completed: true, error: error }
}

const messageRecruiters = (params) => {
  return (dispatch) => {
    dispatch(messageRecruitersRequested())
    return axios
      .post(api.API_URL + '/contact/recruiters', params)
      .then((response) => {
        dispatch(addNotification('actions.message.recruiters.success'))
        return dispatch(messageRecruitersSuccess())
      })
      .catch((error) => {
        dispatch(addNotification('actions.message.recruiters.error'))
        return dispatch(messageRecruitersError(error))
      })
  }
}

export {
  MESSAGE_RECRUITERS_REQUESTED,
  MESSAGE_RECRUITERS_SUCCESS,
  MESSAGE_RECRUITERS_ERROR,
  messageRecruitersRequested,
  messageRecruitersSuccess,
  messageRecruitersError,
  messageRecruiters
}
