import axios from 'axios'
import api from '../consts'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'
import { fetchTask } from './taskActions'

const GET_TASK_SOLUTION_REQUESTED = 'GET_TASK_SOLUTION_REQUESTED'
const GET_TASK_SOLUTION_SUCCESS = 'GET_TASK_SOLUTION_SUCCESS'
const GET_TASK_SOLUTION_ERROR = 'GET_TASK_SOLUTION_ERROR'

const FETCH_PULL_REQUEST_DATA_REQUESTED = 'FETCH_PULL_REQUEST_DATA_REQUESTED'
const FETCH_PULL_REQUEST_DATA_SUCCESS = 'FETCH_PULL_REQUEST_DATA_SUCCESS'
const FETCH_PULL_REQUEST_DATA_ERROR = 'FETCH_PULL_REQUEST_DATA_ERROR'

const CREATE_TASK_SOLUTION_REQUESTED = 'CREATE_TASK_SOLUTION_REQUESTED'
const CREATE_TASK_SOLUTION_SUCCESS = 'CREATE_TASK_SOLUTION_SUCCESS'
const CREATE_TASK_SOLUTION_ERROR = 'CREATE_TASK_SOLUTION_ERROR'

const UPDATE_TASK_SOLUTION_REQUESTED = 'UPDATE_TASK_SOLUTION_REQUESTED'
const UPDATE_TASK_SOLUTION_SUCCESS = 'UPDATE_TASK_SOLUTION_SUCCESS'
const UPDATE_TASK_SOLUTION_ERROR = 'UPDATE_TASK_SOLUTION_ERROR'

const CLEAN_PULL_REQUEST_DATA_STATE = 'CLEAN_PULL_REQUEST_DATA_STATE'

const ERRORS = {
  COULD_NOT_GET_TASK_SOLUTION: 'issue.solution.dialog.get.error',
  COULD_NOT_UPDATE_TASK_SOLUTION: 'issue.solution.dialog.update.error',
  COULD_NOT_CREATE_TASK_SOLUTION: 'issue.solution.dialog.create.error',
  COULD_NOT_FETCH_PULL_REQUEST_DATA: 'issue.solution.dialog.fetch.error',
  PULL_REQUEST_NOT_FOUND: 'issue.solution.dialog.pullRequest.notFound'
}

const getTaskSolutionRequested = () => {
  return { type: GET_TASK_SOLUTION_REQUESTED, completed: false }
}

const getTaskSolutionSuccess = (taskSolution) => {
  return { type: GET_TASK_SOLUTION_SUCCESS, completed: true, taskSolution: taskSolution }
}

const getTaskSolutionError = (error) => {
  return { type: GET_TASK_SOLUTION_ERROR, completed: true, error: error }
}

const getTaskSolution = (taskId) => {
  validToken()
  return (dispatch) => {
    dispatch(getTaskSolutionRequested())
    return axios
      .get(`${api.API_URL}/tasksolutions`, { params: { taskId: taskId } })
      .then((response) => {
        return dispatch(getTaskSolutionSuccess(response.data))
      })
      .catch((error) => {
        if (error) {
          dispatch(addNotification(ERRORS[error], { severity: 'error' }))
          return dispatch(getTaskSolutionError(error))
        }

        dispatch(addNotification(ERRORS['COULD_NOT_GET_TASK_SOLUTION'], { severity: 'error' }))
        return dispatch(getTaskSolutionError(JSON.parse(ERRORS['COULD_NOT_GET_TASK_SOLUTION'])))
      })
  }
}

const fetchPullRequestDataRequested = () => {
  return { type: FETCH_PULL_REQUEST_DATA_REQUESTED, completed: false }
}

const fetchPullRequestDataSuccess = (pullRequestData) => {
  return {
    type: FETCH_PULL_REQUEST_DATA_SUCCESS,
    completed: true,
    pullRequestData: pullRequestData
  }
}

const fetchPullRequestDataError = (error) => {
  return { type: FETCH_PULL_REQUEST_DATA_ERROR, completed: true, error: error }
}

const createTaskSolutionError = (error) => {
  return { type: CREATE_TASK_SOLUTION_ERROR, completed: true, error: error }
}

const fetchPullRequestData = (owner, repositoryName, pullRequestId, taskId) => {
  validToken()
  return (dispatch) => {
    dispatch(fetchPullRequestDataRequested())
    return axios
      .get(`${api.API_URL}/tasksolutions/fetch`, {
        params: {
          owner: owner,
          repositoryName: repositoryName,
          pullRequestId: pullRequestId,
          taskId: taskId
        }
      })
      .then((response) => {
        return dispatch(fetchPullRequestDataSuccess(response.data))
      })
      .catch((error) => {
        if (error.response.data && error.response.data.error) {
          dispatch(addNotification(ERRORS[error.response.data.error], { severity: 'error' }))
          return dispatch(fetchPullRequestDataError(error.response.data.error))
        }

        dispatch(
          addNotification(ERRORS['COULD_NOT_FETCH_PULL_REQUEST_DATA'], { severity: 'error' })
        )
        return dispatch(
          getTaskSolutionError(JSON.parse(ERRORS['COULD_NOT_FETCH_PULL_REQUEST_DATA']))
        )
      })
  }
}

const createTaskSolutionRequested = () => {
  return { type: CREATE_TASK_SOLUTION_REQUESTED, completed: false }
}

const createTaskSolutionSuccess = (taskSolution) => {
  return { type: CREATE_TASK_SOLUTION_SUCCESS, completed: true, taskSolution: taskSolution }
}

const createTaskSolution = (taskSolution) => {
  validToken()
  return (dispatch) => {
    dispatch(createTaskSolutionRequested())
    return axios
      .post(`${api.API_URL}/tasksolutions/create`, taskSolution)
      .then((response) => {
        dispatch(addNotification('issue.solution.dialog.create.success'))
        dispatch(fetchTask(taskSolution.taskId))
        return dispatch(createTaskSolutionSuccess(response.data))
      })
      .catch((error) => {
        if (error.response.data && error.response.data.error) {
          dispatch(
            addNotification(ERRORS[error.response.data.error] || error.response.data.error, {
              extra: '',
              link: '/#/profile/payout-settings',
              text: 'Update your account',
              severity: 'error'
            })
          )
          dispatch(fetchTask(taskSolution.taskId))
          return dispatch(createTaskSolutionError(error.response.data.error))
        }

        dispatch(addNotification(ERRORS['COULD_NOT_CREATE_TASK_SOLUTION'], { severity: 'error' }))
        return dispatch(getTaskSolutionError(JSON.parse(ERRORS['COULD_NOT_CREATE_TASK_SOLUTION'])))
      })
  }
}

const updateTaskSolutionRequested = () => {
  return { type: UPDATE_TASK_SOLUTION_REQUESTED, completed: false }
}

const updateTaskSolutionSuccess = (taskSolution) => {
  return { type: UPDATE_TASK_SOLUTION_SUCCESS, completed: true, taskSolution: taskSolution }
}

const updateTaskSolutionError = (error) => {
  return { type: UPDATE_TASK_SOLUTION_ERROR, completed: true, error: error }
}

const updateTaskSolution = ({ taskSolutionId, pullRequestURL, taskId }) => {
  validToken()
  return (dispatch) => {
    dispatch(updateTaskSolutionRequested())
    return axios
      .patch(`${api.API_URL}/tasksolutions/${taskSolutionId}`, {
        pullRequestURL: pullRequestURL,
        taskId: taskId
      })
      .then((response) => {
        dispatch(addNotification('issue.solution.dialog.update.success'))
        dispatch(fetchTask(taskId))
        return dispatch(updateTaskSolutionSuccess(response.data))
      })
      .catch((error) => {
        if (error.response.data && error.response.data.error) {
          dispatch(addNotification(ERRORS[error.response.data.error], { severity: 'error' }))
          return dispatch(updateTaskSolutionError(error.response.data.error))
        }

        dispatch(addNotification(ERRORS['COULD_NOT_UPDATE_TASK_SOLUTION'], { severity: 'error' }))
        return dispatch(getTaskSolutionError(JSON.parse(ERRORS['COULD_NOT_UPDATE_TASK_SOLUTION'])))
      })
  }
}

const cleanPullRequestDataState = () => {
  return { type: CLEAN_PULL_REQUEST_DATA_STATE, pullRequestData: {} }
}

export {
  fetchPullRequestData,
  createTaskSolution,
  updateTaskSolution,
  getTaskSolution,
  cleanPullRequestDataState,
  GET_TASK_SOLUTION_REQUESTED,
  GET_TASK_SOLUTION_SUCCESS,
  GET_TASK_SOLUTION_ERROR,
  FETCH_PULL_REQUEST_DATA_REQUESTED,
  FETCH_PULL_REQUEST_DATA_SUCCESS,
  CREATE_TASK_SOLUTION_REQUESTED,
  CREATE_TASK_SOLUTION_SUCCESS,
  UPDATE_TASK_SOLUTION_REQUESTED,
  UPDATE_TASK_SOLUTION_SUCCESS,
  CLEAN_PULL_REQUEST_DATA_STATE
}
