import axios from 'axios'
import api from '../consts'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

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
  'COULD_NOT_GET_TASK_SOLUTION': 'task.solution.dialog.get.error',
  'COULD_NOT_UPDATE_TASK_SOLUTION': 'task.solution.dialog.update.error',
  'COULD_NOT_CREATE_TASK_SOLUTION': 'task.solution.dialog.create.error',
  'COULD_NOT_FETCH_PULL_REQUEST_DATA': 'task.solution.dialog.fetch.error',
  'PULL_REQUEST_NOT_FOUND': 'task.solution.dialog.pullRequest.notFound'
}

const getTaskSolutionRequested = () => {
  return { type: GET_TASK_SOLUTION_REQUESTED, completed: false }
}

const getTaskSolutionSuccess = taskSolution => {
  return { type: GET_TASK_SOLUTION_SUCCESS, completed: true, taskSolution: taskSolution }
}

const getTaskSolutionError = error => {
  return { type: GET_TASK_SOLUTION_ERROR, completed: true, error: error }
}

const getTaskSolution = (userId, taskId) => {
  validToken()
  return dispatch => {
    dispatch(getTaskSolutionRequested())
    axios.get(`${api.API_URL}/tasksolutions`, { params: { userId: userId, taskId: taskId } }).then(response => {
      dispatch(getTaskSolutionSuccess(response.data))
    }).catch(error => {
      if (error.response.data && error.response.data.error) {
        dispatch(addNotification(ERRORS[error.response.data.error]))
        return dispatch(getTaskSolutionError(error.response.data.error))
      }

      dispatch(addNotification(ERRORS['COULD_NOT_GET_TASK_SOLUTION']))
      return dispatch(getTaskSolutionError(JSON.parse(ERRORS['COULD_NOT_GET_TASK_SOLUTION'])))
    })
  }
}

const fetchPullRequestDataRequested = () => {
  return { type: FETCH_PULL_REQUEST_DATA_REQUESTED, completed: false }
}

const fetchPullRequestDataSuccess = pullRequestData => {
  return { type: FETCH_PULL_REQUEST_DATA_SUCCESS, completed: true, pullRequestData: pullRequestData }
}

const fetchPullRequestDataError = error => {
  return { type: FETCH_PULL_REQUEST_DATA_ERROR, completed: true, error: error }
}

const createTaskSolutionError = error => {
  return { type: CREATE_TASK_SOLUTION_ERROR, completed: true, error: error }
}

const fetchPullRequestData = (owner, repositoryName, pullRequestId, userId, taskId) => {
  validToken()
  return dispatch => {
    dispatch(fetchPullRequestDataRequested())
    axios.get(`${api.API_URL}/tasksolutions/fetch`, {
      params: { owner: owner, repositoryName: repositoryName, pullRequestId: pullRequestId, userId: userId, taskId: taskId }
    }).then(response => {
      dispatch(fetchPullRequestDataSuccess(response.data))
    }).catch(error => {
      if (error.response.data && error.response.data.error) {
        dispatch(addNotification(ERRORS[error.response.data.error]))
        return dispatch(fetchPullRequestDataError(error.response.data.error))
      }

      dispatch(addNotification(ERRORS['COULD_NOT_FETCH_PULL_REQUEST_DATA']))
      return dispatch(getTaskSolutionError(JSON.parse(ERRORS['COULD_NOT_FETCH_PULL_REQUEST_DATA'])))
    })
  }
}

const createTaskSolutionRequested = () => {
  return { type: CREATE_TASK_SOLUTION_REQUESTED, completed: false }
}

const createTaskSolutionSuccess = taskSolution => {
  return { type: CREATE_TASK_SOLUTION_SUCCESS, completed: true, taskSolution: taskSolution }
}

const createTaskSolution = (taskSolution) => {
  validToken()
  return dispatch => {
    dispatch(createTaskSolutionRequested())
    axios.post(`${api.API_URL}/tasksolutions/create`, taskSolution).then(response => {
      dispatch(createTaskSolutionSuccess(response.data))
    }).catch(error => {
      if (error.response.data && error.response.data.error) {
        dispatch(addNotification(ERRORS[error.response.data.error]))
        return dispatch(createTaskSolutionError(error.response.data.error))
      }

      dispatch(addNotification(ERRORS['COULD_NOT_CREATE_TASK_SOLUTION']))
      return dispatch(getTaskSolutionError(JSON.parse(ERRORS['COULD_NOT_CREATE_TASK_SOLUTION'])))
    })
  }
}

const updateTaskSolutionRequested = () => {
  return { type: UPDATE_TASK_SOLUTION_REQUESTED, completed: false }
}

const updateTaskSolutionSuccess = taskSolution => {
  return { type: UPDATE_TASK_SOLUTION_SUCCESS, completed: true, taskSolution: taskSolution }
}

const updateTaskSolutionError = error => {
  return { type: UPDATE_TASK_SOLUTION_ERROR, completed: true, error: error }
}

const updateTaskSolution = ({ taskSolutionId, pullRequestURL, userId, taskId }) => {
  validToken()
  return dispatch => {
    dispatch(updateTaskSolutionRequested())
    axios.patch(`${api.API_URL}/tasksolutions/${taskSolutionId}`, { pullRequestURL: pullRequestURL, userId: userId, taskId: taskId }).then(response => {
      dispatch(updateTaskSolutionSuccess(response.data))
    }).catch(error => {
      if (error.response.data && error.response.data.error) {
        dispatch(addNotification(ERRORS[error.response.data.error]))
        return dispatch(updateTaskSolutionError(error.response.data.error))
      }

      dispatch(addNotification(ERRORS['COULD_NOT_UPDATE_TASK_SOLUTION']))
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
