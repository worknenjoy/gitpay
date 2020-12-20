import api from '../consts'
import axios from 'axios'
import { addNotification } from './notificationActions'

const FETCH_PROJECT_REQUESTED = 'FETCH_PROJECT_REQUESTED'
const FETCH_PROJECT_SUCCESS = 'FETCH_PROJECT_SUCCESS'
const FETCH_PROJECT_ERROR = 'FETCH_PROJECT_ERROR'

/*
 * Project fetch
 */

const fetchProjectRequested = () => {
  return { type: FETCH_PROJECT_REQUESTED, completed: false }
}

const fetchProjectSuccess = projects => {
  return { type: FETCH_PROJECT_SUCCESS, completed: true, data: projects.data }
}

const fetchProjectError = error => {
  return { type: FETCH_PROJECT_ERROR, completed: true, error: error }
}

const fetchProject = projectId => {
  return dispatch => {
    dispatch(fetchProjectRequested())
    axios
      .get(api.API_URL + `/projects/fetch/${projectId}`)
      .then(project => {
        if (project.data) {
          return dispatch(fetchProjectSuccess(project))
        }
        dispatch(
          addNotification('actions.task.fetch.error')
        )
        return dispatch(
          fetchProjectError({ message: 'actions.task.fetch.unavailable' })
        )
      })
      .catch(e => {
        dispatch(
          addNotification('actions.task.fetch.other.error')
        )
        dispatch(fetchProjectError(e))
        // eslint-disable-next-line no-console
        console.log('not possible to fetch issue')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

export {
  FETCH_PROJECT_REQUESTED,
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECT_ERROR,
  fetchProject
}
