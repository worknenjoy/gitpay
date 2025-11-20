import axios from 'axios'
import api from '../consts'
import { addNotification } from './notificationActions'

const JOIN_TEAM_REQUESTED = 'JOIN_TEAM_REQUESTED'
const JOIN_TEAM_SUCCESS = 'CREATE_TASK_SUCCESS'
const JOIN_TEAM_ERROR = 'CREATE_TASK_ERROR'

/**
 * Join core team
 */

const joinTeamRequested = () => {
  return { type: JOIN_TEAM_REQUESTED, completed: false }
}

const joinTeamSuccess = () => {
  return { type: JOIN_TEAM_SUCCESS, completed: true }
}

const joinTeamError = (error) => {
  return { type: JOIN_TEAM_ERROR, completed: true, error: error }
}

const joinTeam = (email) => {
  const param = {
    email: email,
  }
  return (dispatch) => {
    dispatch(joinTeamRequested())
    return axios
      .post(api.API_URL + '/team/core/join', { param })
      .then((task) => {
        if (task.status === 200 && !task.data && !task.data.error) {
          dispatch(addNotification('Sent email successfully'))
          return dispatch(joinTeamSuccess())
        }
      })
      .catch((error) => {
        dispatch(addNotification('Oops! Email could not be sent'))
        // eslint-disable-next-line no-console
        console.log('error on join team notification', error)
        return dispatch(joinTeamError(error))
      })
  }
}

export { JOIN_TEAM_REQUESTED, JOIN_TEAM_SUCCESS, JOIN_TEAM_ERROR, joinTeam }
