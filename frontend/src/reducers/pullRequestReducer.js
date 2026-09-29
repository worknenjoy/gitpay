import {
  RESOLVE_PULL_REQUEST_REQUESTED,
  RESOLVE_PULL_REQUEST_SUCCESS,
  RESOLVE_PULL_REQUEST_ERROR,
  SEARCH_MY_PULL_REQUESTS_REQUESTED,
  SEARCH_MY_PULL_REQUESTS_SUCCESS,
  SEARCH_MY_PULL_REQUESTS_ERROR,
  POST_PULL_REQUEST_COMMENT_REQUESTED,
  POST_PULL_REQUEST_COMMENT_SUCCESS,
  POST_PULL_REQUEST_COMMENT_ERROR
} from '../actions/pullRequestActions'

export const pullRequest = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case RESOLVE_PULL_REQUEST_REQUESTED:
      return { ...state, completed: action.completed }
    case RESOLVE_PULL_REQUEST_SUCCESS:
      return { ...state, completed: action.completed, data: action.pullRequest }
    case RESOLVE_PULL_REQUEST_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}

export const myPullRequests = (state = { data: [], completed: true, error: {} }, action) => {
  switch (action.type) {
    case SEARCH_MY_PULL_REQUESTS_REQUESTED:
      return { ...state, completed: action.completed }
    case SEARCH_MY_PULL_REQUESTS_SUCCESS:
      return { ...state, completed: action.completed, data: action.pullRequests }
    case SEARCH_MY_PULL_REQUESTS_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}

export const pullRequestComment = (state = { data: {}, completed: true, error: {} }, action) => {
  switch (action.type) {
    case POST_PULL_REQUEST_COMMENT_REQUESTED:
      return { ...state, completed: action.completed }
    case POST_PULL_REQUEST_COMMENT_SUCCESS:
      return { ...state, completed: action.completed, data: action.comment }
    case POST_PULL_REQUEST_COMMENT_ERROR:
      return { ...state, completed: action.completed, error: action.error }
    default:
      return state
  }
}
