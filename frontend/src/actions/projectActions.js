import api from '../consts'
import axios from 'axios'
import { addNotification } from './notificationActions'

const FETCH_PROJECT_REQUESTED = 'FETCH_PROJECT_REQUESTED'
const FETCH_PROJECT_SUCCESS = 'FETCH_PROJECT_SUCCESS'
const FETCH_PROJECT_ERROR = 'FETCH_PROJECT_ERROR'

const LIST_PROJECTS_REQUESTED = 'LIST_PROJECTS_REQUESTED'
const LIST_PROJECTS_SUCCESS = 'LIST_PROJECTS_SUCCESS'
const LIST_PROJECTS_ERROR = 'LIST_PROJECTS_ERROR'

/*
 * Project fetch
 */

const fetchProjectRequested = () => {
  return { type: FETCH_PROJECT_REQUESTED, completed: false }
}

const fetchProjectSuccess = (project) => {
  return { type: FETCH_PROJECT_SUCCESS, completed: true, data: project.data }
}

const fetchProjectError = (error) => {
  return { type: FETCH_PROJECT_ERROR, completed: true, error: error }
}

const fetchProject = (projectId, params) => {
  return (dispatch) => {
    dispatch(fetchProjectRequested())
    axios
      .get(api.API_URL + `/projects/fetch/${projectId}`, { params })
      .then((project) => {
        if (project.data) {
          return dispatch(fetchProjectSuccess(project))
        }
        dispatch(addNotification('actions.task.fetch.error'))
        return dispatch(fetchProjectError({ message: 'actions.task.fetch.unavailable' }))
      })
      .catch((e) => {
        dispatch(addNotification('actions.task.fetch.other.error'))
        dispatch(fetchProjectError(e))
        // eslint-disable-next-line no-console
        console.log('not possible to fetch issue')
        // eslint-disable-next-line no-console
        console.log(e)
      })
  }
}

/*
 * Project fetch
 */

const listProjectsRequested = () => {
  return { type: LIST_PROJECTS_REQUESTED, completed: false }
}

const listProjectsSuccess = (projects) => {
  return { type: LIST_PROJECTS_SUCCESS, completed: true, data: projects.data }
}

const listProjectsError = (error) => {
  return { type: LIST_PROJECTS_ERROR, completed: true, error: error }
}

const listProjects = () => {
  return (dispatch) => {
    dispatch(listProjectsRequested())
    axios
      .get(api.API_URL + '/projects/list')
      .then((projects) => {
        if (projects.data) {
          return dispatch(listProjectsSuccess(projects))
        }
        dispatch(addNotification('actions.task.fetch.error'))
        return dispatch(listProjectsError({ message: 'actions.task.fetch.unavailable' }))
      })
      .catch((e) => {
        dispatch(addNotification('actions.task.fetch.other.error'))
        dispatch(listProjectsError(e))
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
  LIST_PROJECTS_REQUESTED,
  LIST_PROJECTS_SUCCESS,
  LIST_PROJECTS_ERROR,
  fetchProject,
  listProjects,
}
