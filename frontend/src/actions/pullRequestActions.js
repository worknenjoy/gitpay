import api from '../consts'
import axios from 'axios'
import { validToken } from './helpers'
import { addNotification } from './notificationActions'

const RESOLVE_PULL_REQUEST_REQUESTED = 'RESOLVE_PULL_REQUEST_REQUESTED'
const RESOLVE_PULL_REQUEST_SUCCESS = 'RESOLVE_PULL_REQUEST_SUCCESS'
const RESOLVE_PULL_REQUEST_ERROR = 'RESOLVE_PULL_REQUEST_ERROR'

const SEARCH_MY_PULL_REQUESTS_REQUESTED = 'SEARCH_MY_PULL_REQUESTS_REQUESTED'
const SEARCH_MY_PULL_REQUESTS_SUCCESS = 'SEARCH_MY_PULL_REQUESTS_SUCCESS'
const SEARCH_MY_PULL_REQUESTS_ERROR = 'SEARCH_MY_PULL_REQUESTS_ERROR'

const POST_PULL_REQUEST_COMMENT_REQUESTED = 'POST_PULL_REQUEST_COMMENT_REQUESTED'
const POST_PULL_REQUEST_COMMENT_SUCCESS = 'POST_PULL_REQUEST_COMMENT_SUCCESS'
const POST_PULL_REQUEST_COMMENT_ERROR = 'POST_PULL_REQUEST_COMMENT_ERROR'

// Backend error codes -> static translation ids (see src/messages/notification-messages.js).
// Static, not built from a template string, so `npm run translate` can actually extract them.
const RESOLVE_ERROR_MESSAGES = {
  PULL_REQUEST_NOT_FOUND: 'actions.pullRequest.resolve.error.notFound',
  GITHUB_ACCOUNT_NOT_LINKED: 'actions.pullRequest.resolve.error.notLinked',
  PULL_REQUEST_NOT_AUTHORED_BY_USER: 'actions.pullRequest.resolve.error.notAuthor',
  PULL_REQUEST_NOT_MERGED: 'actions.pullRequest.resolve.error.notMerged'
}
const RESOLVE_ERROR_FALLBACK = 'actions.pullRequest.resolve.error.generic'

const MINE_ERROR_MESSAGES = {
  GITHUB_ACCOUNT_NOT_LINKED: 'actions.pullRequest.mine.error.notLinked'
}
const MINE_ERROR_FALLBACK = 'actions.pullRequest.mine.error.generic'

export const resolvePullRequestRequested = () => {
  return { type: RESOLVE_PULL_REQUEST_REQUESTED, completed: false }
}

export const resolvePullRequestSuccess = (pullRequest) => {
  return { type: RESOLVE_PULL_REQUEST_SUCCESS, completed: true, pullRequest }
}

export const resolvePullRequestError = (error) => {
  return { type: RESOLVE_PULL_REQUEST_ERROR, completed: true, error }
}

export const resolvePullRequest = (url) => {
  validToken()
  return (dispatch) => {
    dispatch(resolvePullRequestRequested())
    return axios
      .get(api.API_URL + '/pull-requests', { params: { url } })
      .then((response) => {
        return dispatch(resolvePullRequestSuccess(response.data))
      })
      .catch((e) => {
        const errorCode = e.response?.data?.error
        const messageId = RESOLVE_ERROR_MESSAGES[errorCode] || RESOLVE_ERROR_FALLBACK
        dispatch(addNotification(messageId, { severity: 'error' }))
        return dispatch(resolvePullRequestError(e))
      })
  }
}

export const searchMyPullRequestsRequested = () => {
  return { type: SEARCH_MY_PULL_REQUESTS_REQUESTED, completed: false }
}

export const searchMyPullRequestsSuccess = (pullRequests) => {
  return { type: SEARCH_MY_PULL_REQUESTS_SUCCESS, completed: true, pullRequests }
}

export const searchMyPullRequestsError = (error) => {
  return { type: SEARCH_MY_PULL_REQUESTS_ERROR, completed: true, error }
}

export const searchMyPullRequests = (params) => {
  validToken()
  return (dispatch) => {
    dispatch(searchMyPullRequestsRequested())
    return axios
      .get(api.API_URL + '/pull-requests/mine', { params })
      .then((response) => {
        return dispatch(searchMyPullRequestsSuccess(response.data))
      })
      .catch((e) => {
        const errorCode = e.response?.data?.error
        const messageId = MINE_ERROR_MESSAGES[errorCode] || MINE_ERROR_FALLBACK
        dispatch(addNotification(messageId, { severity: 'error' }))
        return dispatch(searchMyPullRequestsError(e))
      })
  }
}

export const postPullRequestCommentRequested = () => {
  return { type: POST_PULL_REQUEST_COMMENT_REQUESTED, completed: false }
}

export const postPullRequestCommentSuccess = (comment) => {
  return { type: POST_PULL_REQUEST_COMMENT_SUCCESS, completed: true, comment }
}

export const postPullRequestCommentError = (error) => {
  return { type: POST_PULL_REQUEST_COMMENT_ERROR, completed: true, error }
}

export const postPullRequestComment = (paymentRequestId, commentBody) => {
  validToken()
  return (dispatch) => {
    dispatch(postPullRequestCommentRequested())
    return axios
      .post(api.API_URL + `/pull-requests/${paymentRequestId}/comment`, { commentBody })
      .then((response) => {
        dispatch(addNotification('actions.pullRequest.comment.success'))
        return dispatch(postPullRequestCommentSuccess(response.data))
      })
      .catch((e) => {
        const errorCode = e.response?.data?.error
        const messageId =
          errorCode === 'GITHUB_WRITE_ACCESS_REQUIRED'
            ? 'actions.pullRequest.comment.error.needsGithubAccess'
            : 'actions.pullRequest.comment.error'
        dispatch(addNotification(messageId, { severity: 'error' }))
        return dispatch(postPullRequestCommentError(e))
      })
  }
}

export {
  RESOLVE_PULL_REQUEST_REQUESTED,
  RESOLVE_PULL_REQUEST_SUCCESS,
  RESOLVE_PULL_REQUEST_ERROR,
  SEARCH_MY_PULL_REQUESTS_REQUESTED,
  SEARCH_MY_PULL_REQUESTS_SUCCESS,
  SEARCH_MY_PULL_REQUESTS_ERROR,
  POST_PULL_REQUEST_COMMENT_REQUESTED,
  POST_PULL_REQUEST_COMMENT_SUCCESS,
  POST_PULL_REQUEST_COMMENT_ERROR
}
